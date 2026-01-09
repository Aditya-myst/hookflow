import os
import random
import json
import hmac
import hashlib
from fastapi import FastAPI, Query, HTTPException, Depends, Security, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load variables and Initialize App
load_dotenv()
app = FastAPI()

@app.get("/")
async def root():
    return {"status": "HookFlow API is Live", "version": "1.0.0"}

# 2. Enable CORS (Restricted for Production)
allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialize Clients
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

from auth import VerifyToken
from fastapi import Depends

@app.get("/api/hooks/generate")
async def generate_all(
    topic: str, 
    tone: str, 
    niche: str, 
    goal: str, 
    platform: str, 
    psychology: str,
    auth_result = Depends(VerifyToken())
):
    try:
        # 0. SYNC USER & CHECK CREDITS
        try:
            user_id = auth_result.get("sub")
            email = auth_result.get("email") or auth_result.get("primary_email_address") or "" 
            
            # 1. Fetch user
            user_res = supabase.table("users").select("*").eq("user_id", user_id).execute()
            
            from datetime import datetime, date
            current_credits = 3
            plan = "free"

            if user_res.data:
                user = user_res.data[0]
                current_credits = user.get("credits", 0)
                plan = user.get("plan", "free")
                last_reset_str = user.get("last_reset_date")
                today_str = date.today().isoformat()

                # --- DAILY RESET LOGIC ---
                if plan.lower() == "free" and last_reset_str != today_str:
                    # Reset to 3 credits for the new day
                    current_credits = 3
                    try:
                        supabase.table("users").update({
                            "credits": 3,
                            "last_reset_date": today_str
                        }).eq("user_id", user_id).execute()
                        print(f"Daily reset performed for user {user_id}")
                    except Exception as e:
                        print(f"Daily reset failed (DB issue): {e}")

            else:
                # Sync user if missing
                try:
                    today_str = date.today().isoformat()
                    supabase.table("users").upsert({
                        "user_id": user_id, 
                        "email": email,
                        "plan": "free",
                        "credits": 3,
                        "last_reset_date": today_str
                    }, on_conflict="user_id").execute()
                except Exception as e:
                    print(f"Initial user sync failed (DB issue): {e}")
                current_credits = 3
                plan = "free"
            
            # 2. Check limits
            if plan.lower() == "free" and current_credits <= 0:
                raise HTTPException(status_code=402, detail="Daily limit reached (3/3). Upgrade to Pro for unlimited generation.")

            # 3. Deduct credit (if Free)
            if plan.lower() == "free":
                new_credits = current_credits - 1
                try:
                    supabase.table("users").update({"credits": new_credits}).eq("user_id", user_id).execute()
                    print(f"Deducted credit for user {user_id}. Remaining: {new_credits}")
                except Exception as e:
                    print(f"Credit deduction failed (DB issue): {e}")
        except HTTPException:
            raise
        except Exception as sync_e:
            print(f"User Sync Logic Error: {sync_e}")
            # Do not block generation if DB has transient issues, but log it.
            pass


        # 4. FETCH 3 EXAMPLES (Optional - graceful fallback)
        try:
            response = supabase.table("hook_templates") \
                .select("hook_text, hook_structure") \
                .ilike("psychology_triggers", f"%{psychology}%") \
                .limit(3) \
                .execute()

            examples_text = ""
            if response.data:
                for i, item in enumerate(response.data):
                    examples_text += f"Example {i+1}: {item['hook_text']}\n"
            else:
                examples_text = "Standard viral hooks structure."
        except Exception:
            print("Template fetch failed (ignoring)")
            examples_text = "Standard viral hooks structure."

        # 5. THE ADVANCED PROMPT
        prompt = f"""
        Act as a World-Class Viral Content Creator. 
        Your goal is to generate 10 unique, high-performing video hooks for {platform}.
        Topic: {topic}
        Tone: {tone}
        Strategy: {psychology}
        Target Goal: {goal}

        {examples_text}

        REQUIREMENTS:
        1. "hook": A punchy, scroll-stopping opening line (under 15 words).
        2. "caption": A short, engaging caption for the post.
        3. "strategy_leak": A 1-sentence explanation of why this hook works based on {psychology}.

        Strict JSON format:
        [
          {{
            "hook": "...",
            "caption": "...",
            "strategy_leak": "..."
          }}
        ]
        
        CRITICAL: Provide 10 distinct variations. DO NOT return empty strings.
        """

        # 6. GENERATE (FREE)
        try:
            # Add safety settings to avoid blocked responses
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
            result = model.generate_content(prompt, safety_settings=safety_settings)
            
            if not result.text:
                print("DEBUG: AI returned EMPTY TEXT")
                return {"error": "AI service returned empty response. Please try a different topic."}, 500
                
            print(f"DEBUG: AI RAW TEXT (FIRST 100) -> {result.text[:100]}...")
        except Exception as gemini_error:
            if "quota" in str(gemini_error).lower():
                return {"error": "AI Service Quota Exceeded. Please try again in a minute."}, 429
            print(f"Gemini Error: {gemini_error}")
            return {"error": "AI Generation failed"}, 500
        
        # Robust JSON extraction
        try:
            text = result.text.strip()
            # Remove Markdown code blocks if present
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            
            start_idx = text.find('[')
            end_idx = text.rfind(']')
            
            if start_idx != -1 and end_idx != -1:
                json_str = text[start_idx:end_idx+1]
                data = json.loads(json_str)
                # If it's a list, return it
                if isinstance(data, list):
                    return data
                # If it's a dict, wrap it
                return [data]
            else:
                 # Check if it's a single object without brackets
                 start_obj = text.find('{')
                 end_obj = text.rfind('}')
                 if start_obj != -1 and end_obj != -1:
                     json_str = text[start_obj:end_obj+1]
                     data = json.loads(json_str)
                     return [data]
                 
                 print(f"AI Output (Not JSON): {text}")
                 return {"error": "AI response was not valid JSON", "raw": text}, 500
                 
        except Exception as parse_error:
            print(f"JSON Parse Error: {parse_error}")
            raise HTTPException(status_code=500, detail="Failed to parse AI response")

    except HTTPException:
        raise
    except Exception as e:
        print(f"Endpoint Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------------
#  WEBHOOKS (Sync Clerk Users to Supabase)
# -------------------------------------------------------------------

import hmac
import hashlib
from svix.webhooks import Webhook, WebhookVerificationError
from fastapi import Request

@app.post("/api/webhooks/clerk")
async def clerk_webhook(request: Request):
    """
    Listen to Clerk events (user.created, user.updated) and sync to Supabase.
    """
    # 1. Get Headers
    headers = request.headers
    svix_id = headers.get("svix-id")
    svix_timestamp = headers.get("svix-timestamp")
    svix_signature = headers.get("svix-signature")

    if not svix_id or not svix_timestamp or not svix_signature:
        return {"message": "Missing svix headers"}, 400

    # 2. Get Body
    payload = await request.body()
    secret = os.getenv("CLERK_WEBHOOK_SECRET")

    # 3. Verify Signature
    try:
        wh = Webhook(secret)
        # Webhook.verify raises an exception if verification fails
        evt = wh.verify(payload, headers)
    except WebhookVerificationError:
        return {"message": "Invalid signature"}, 400
    except Exception as e:
         return {"message": f"Verification failed: {str(e)}"}, 400

    # 4. Handle Event
    event_type = evt.get("type")
    data = evt.get("data")

    print(f"WEBHOOK RECEIVED: {event_type}")

    if event_type in ["user.created", "user.updated"]:
        # Extract user info
        user_id = data.get("id")
        email_addresses = data.get("email_addresses", [])
        primary_email_id = data.get("primary_email_address_id")
        
        # Find primary email
        email = ""
        for e in email_addresses:
            if e.get("id") == primary_email_id:
                email = e.get("email_address")
                break
        
        # Fallback if primary id search fails but list exists
        if not email and email_addresses:
            email = email_addresses[0].get("email_address")

        # Sync to Supabase
        try:
            user_data = {
                "user_id": user_id,
                "email": email,
                # For new users, we can set defaults. For updates, we might want to be careful not to overwrite plan if not in payload
                # But typically Clerk webhook sends full user object. 
                # To be safe for updates, we might want to ONLY upsert id/email and ignore plan/credits unless we track them in Clerk metadata.
                # For simplicity here, we stick to ID/Email and default plan if missing (but upsert handles existing rows gracefully if we don't pass all cols?)
                # Upsert replaces the row if we provide all data. If we just want to update email, we should be careful.
                # Actually Supabase upsert will update the columns provided.
                # Let's ensure we don't reset 'plan' or 'credits' to null/default on 'user.updated' if we don't want to.
                # Ideally, we verify if user exists first or use a more specific update.
                # For this MVP, let's assume we just want to ensure ID/Email are in sync.
                "email": email
            }
            # Only set defaults on insert (trickier with simple upsert). 
            # Let's just do a basic upsert for ID/Email. 
            # NOTE: If rows exist, this updates email. It WON'T touch plan/credits if we don't pass them, 
            # PROVIDED we use the right query. 
            # supabase-py's upsert: data dict. 
            
            # Better strategy: 
            # 1. Try to get user
            # 2. If exists, update email.
            # 3. If not, insert with defaults.
            
            # Simplified for MVP: Just upsert ID and Email. 
            # If it's a new user, Supabase might complain if 'plan' is required but has default? (It has default 'free').
            
            res = supabase.table("users").upsert({
                "user_id": user_id, 
                "email": email
            }, on_conflict="user_id").execute()
            
            print(f"Synced user {user_id} to Supabase")
            
        except Exception as db_e:
            print(f"Failed to sync user to DB: {db_e}")

    return {"status": "ok"}


# -------------------------------------------------------------------
#  DASHBOARD ENDPOINT
# -------------------------------------------------------------------

@app.get("/api/user/dashboard")
async def get_dashboard_data(auth_result = Depends(VerifyToken())):
    """
    Fetch user stats and simple history.
    """
    try:
        user_id = auth_result.get("sub")
        
        # 1. Fetch User Stats (Plan, Credits)
        user_res = supabase.table("users").select("*").eq("user_id", user_id).execute()
        
        if not user_res.data:
            # User might not exist yet if webhook failed or simple laziness. 
            # Create a basic record on the fly ?
            # Or return defaults.
            user_info = {
                "plan": "free",
                "credits": 3, # Default free credits
                "user_id": user_id
            }
            # Optional: auto-create user here too just in case
            try:
                supabase.table("users").insert({"user_id": user_id, "email": "", "plan": "free"}).execute()
            except:
                pass
        else:
            user_info = user_res.data[0]
            # --- SYNC CREDITS ON DASHBOARD LOAD ---
            try:
                from datetime import date
                today_str = date.today().isoformat()
                if user_info.get("plan") == "free" and (user_info.get("last_reset_date") != today_str or user_info.get("credits", 0) > 3):
                    # Force reset if new day OR if they have legacy 5 credits
                    supabase.table("users").update({
                        "credits": 3,
                        "last_reset_date": today_str
                    }).eq("user_id", user_id).execute()
                    user_info["credits"] = 3
            except Exception as reset_err:
                print(f"Credit sync skipped (Column likely missing): {reset_err}")

        # 2. Fetch History (Optional - for now just return empty or mock)
        # We haven't set up a 'history' table yet. 
        # let's mock it or return empty list.
        history = []
        
        return {
            "stats": {
                "plan": user_info.get("plan", "free"),
                "credits": user_info.get("credits", 0)
            },
            "history": history
        }

    except Exception as e:
        print(f"Dashboard Error: {e}")
        return {"error": str(e)}, 500

# Note: Do not put 'app.run' here. Use the command below.

@app.get("/api/captions/generate")
async def generate_captions(
    topic: str,
    platform: str,
    tone: str,
    auth_result = Depends(VerifyToken())
):
    try:
        # SYNC USER & CHECK CREDITS
        user_id = auth_result.get("sub")
        email = auth_result.get("email") or auth_result.get("primary_email_address") or ""
        
        # 1. Fetch user logic
        current_credits = 3
        plan = "free"
        
        try:
            user_res = supabase.table("users").select("plan, credits").eq("user_id", user_id).execute()
            
            if user_res.data:
                user = user_res.data[0]
                current_credits = user.get("credits", 0)
                plan = user.get("plan", "free")
            else:
                supabase.table("users").upsert({
                    "user_id": user_id, 
                    "email": email,
                    "plan": "free",
                    "credits": 3
                }, on_conflict="user_id").execute()
            
            # 2. Check limits
            if plan.lower() == "free" and current_credits <= 0:
                raise HTTPException(status_code=402, detail="Insufficient credits. Please upgrade to Pro for unlimited access.")

            # 3. Deduct credit (if Free)
            if plan.lower() == "free":
                 new_credits = current_credits - 1
                 supabase.table("users").update({"credits": new_credits}).eq("user_id", user_id).execute()
        except HTTPException:
            raise
        except Exception as e:
            print(f"Captions DB sync failed: {e}")
            # Do not block generation
            pass

        # PROMPT
        prompt = f"""
        Act as a professional social media manager.
        Generate 5 engaging captions for {platform} about: {topic}.
        Tone: {tone}.

        OUTPUT REQUIREMENTS:
        - Format for {platform} (use line breaks/emojis).
        - Include 3-5 relevant hashtags.
        - Return ONLY a valid JSON array.
        - NO Markdown blocks. NO intro text.

        JSON FORMAT:
        [
            {{
                "id": "1",
                "text": "Caption text...",
                "hashtags": ["tag1", "tag2"]
            }}
        ]
        """

        # 6. GENERATE (FREE)
        try:
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
            result = model.generate_content(prompt, safety_settings=safety_settings)
            if not result.text:
                return {"error": "AI returned empty response"}, 500
        except Exception as gemini_error:
            # Check for quota
            if "quota" in str(gemini_error).lower():
                return {"error": "AI Service Quota Exceeded. Please try again in a minute."}, 429
            print(f"Captions Gemini Error: {gemini_error}")
            return {"error": "AI Generation failed"}, 500

        # Robust JSON extraction
        try:
            text = result.text.strip()
            # Remove Markdown code blocks if present
            if text.startswith("```"):
                # Try to extract content between ```json and ``` or just ``` and ```
                parts = text.split("```")
                if len(parts) >= 3:
                    text = parts[1] # middle part
                    if text.startswith("json"):
                        text = text[4:].strip()
                else:
                    text = parts[1]
            
            # Find the first '[' and last ']'
            start_idx = text.find('[')
            end_idx = text.rfind(']')
            
            if start_idx != -1 and end_idx != -1:
                json_str = text[start_idx:end_idx+1]
                data = json.loads(json_str)
                return data
            else:
                 # Try parsing as a single object if array not found
                 start_obj = text.find('{')
                 end_obj = text.rfind('}')
                 if start_obj != -1 and end_obj != -1:
                     obj_str = text[start_obj:end_obj+1]
                     data = [json.loads(obj_str)]
                     return data
                 
                 print(f"AI Output (Not JSON): {text}")
                 raise HTTPException(status_code=500, detail="AI response was not valid JSON")
                 
        except Exception as parse_error:
            print(f"JSON Parse Error: {parse_error}")
            raise HTTPException(status_code=500, detail="Failed to parse AI response")

    except HTTPException:
        raise
    except Exception as e:
        print(f"Captions Endpoint Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------------
#  PAYPAL VERIFICATION
# -------------------------------------------------------------------
import requests

@app.post("/api/verify-payment")
async def verify_payment(
    request: Request,
    auth_result = Depends(VerifyToken())
):
    try:
        body = await request.json()
        order_id = body.get("orderID")
        
        if not order_id:
            raise HTTPException(status_code=400, detail="Missing orderID")

        user_id = auth_result.get("sub")
        
        # 1. Get Access Token
        client_id = os.getenv("PAYPAL_CLIENT_ID")
        secret = os.getenv("PAYPAL_CLIENT_SECRET")
        
        # Sandbox or Live URL based on env (default sandbox)
        paypal_base = "https://api-m.sandbox.paypal.com"
        
        auth_response = requests.post(
            f"{paypal_base}/v1/oauth2/token",
            auth=(client_id, secret),
            data={"grant_type": "client_credentials"}
        )
        
        if not auth_response.ok:
            print(f"PayPal Auth Failed: {auth_response.text}")
            raise HTTPException(status_code=500, detail="Payment verification failed (Auth)")
            
        access_token = auth_response.json().get("access_token")
        
        # 2. Verify Order
        order_response = requests.get(
            f"{paypal_base}/v2/checkout/orders/{order_id}",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        order_data = order_response.json()
        status = order_data.get("status")
        
        if status == "COMPLETED" or status == "APPROVED":
             # 3. Upgrade User
             supabase.table("users").update({
                 "plan": "pro",
                 "credits": 999999
             }).eq("user_id", user_id).execute()
             
             return {"status": "success", "plan": "pro"}
        else:
            raise HTTPException(status_code=400, detail=f"Payment status: {status}")

    except Exception as e:
        print(f"Payment Error: {e}")
        return {"error": str(e)}, 500