import os
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

class VerifyToken:
    """
    Validate the Clerk JWT Token with Signature Verification.
    """
    def __init__(self):
        self.security = HTTPBearer()
        # In Production, you get this from Clerk Dashboard -> Paths -> JWT Templates -> Public Key
        self.public_key = os.getenv("CLERK_JWT_PUBLIC_KEY")
        if self.public_key:
            print(f"DEBUG: CLERK_JWT_PUBLIC_KEY loaded (Length: {len(self.public_key)})")

    async def __call__(self, credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())):
        token = credentials.credentials
        
        if not self.public_key:
            # Fallback for development if key isn't set yet, but log a warning
            print("WARNING: CLERK_JWT_PUBLIC_KEY not set. Falling back to unverified decode (UNSAFE FOR PROD)")
            return jwt.decode(token, options={"verify_signature": False})

        try:
            # Robust PEM formatting
            key_body = self.public_key.replace("-----BEGIN PUBLIC KEY-----", "").replace("-----END PUBLIC KEY-----", "").strip()
            public_key_pem = f"-----BEGIN PUBLIC KEY-----\n{key_body}\n-----END PUBLIC KEY-----"
            
            payload = jwt.decode(
                token, 
                public_key_pem, 
                algorithms=["RS256"],
                options={"verify_exp": True}
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError as e:
            print(f"JWT Error: {e}")
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        except Exception as e:
            print(f"Auth Exception: {e}")
            raise HTTPException(status_code=401, detail="Authentication failed")
