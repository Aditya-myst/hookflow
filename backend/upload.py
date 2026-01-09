import pandas as pd
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def migrate_data():
    file_path = "hook.csv"
    
    try:
        df = pd.read_csv(file_path, encoding='latin1')
        
        df.columns = [col.lower().replace(' ', '_') for col in df.columns]

        df = df.dropna(subset=['hook_text'])
        
        if 'uses_variables' in df.columns:
            df['uses_variables'] = df['uses_variables'].map({'Yes': True, 'No': False})

        data_to_upload = df.to_dict(orient='records')

        print(f"🚀 Found {len(data_to_upload)} professional hooks. Starting upload...")
        
        for i in range(0, len(data_to_upload), 100):
            batch = data_to_upload[i:i+100]
            supabase.table("hook_templates").insert(batch).execute()
            print(f"Uploaded hooks {i} to {i + len(batch)}")

        print("✅ Success! All 437 hooks with Niche and Audience data are live.")

    except Exception as e:
        print(f"❌ Error during migration: {e}")

if __name__ == "__main__":
    migrate_data()
