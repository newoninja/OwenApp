import json
import os
from google import genai
from google.genai import types

# --- GLOBAL DEFINITIONS (NO INDENTATION) ---
# The client is initialized once globally.
client = genai.Client()

SYSTEM_PROMPT = "You are a strategic AI Automation Consultant. The user provides a business context and a problem. Your task is to generate a concise, three-step automation plan (using AI/Code/APIs) that directly solves their stated problem, focusing on minimizing human error and maximizing efficiency. Output ONLY a JSON array containing three strings, where each string is one step of the roadmap. Do NOT include any introductory or concluding text outside the JSON array."


# --- HANDLER FUNCTION (START OF EXECUTION) ---
def handler(event, context):
    # DEBUG LINE (Indented once)
    print("DEBUG: API Key Check:", os.environ.get('GEMINI_API_KEY') is not None) 
    
    try:
        # 1. Parse the request body (Indented twice, inside try block)
        data = json.loads(event['body'])
        business = data.get('business', '')
        problem = data.get('problem', '')

        if not business or not problem:
            return {
                'statusCode': 400,
                'body': json.dumps({"error": "Missing input."})
            }

        query = f"Business/Industry: {business}. Key Problem: {problem}."
        
        # 2. Configure the Gemini API call
        config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
            response_schema=types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.STRING)
            )
        )
        
        # 3. Call the Gemini Model securely
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[query],
            config=config,
        )

        # 4. Return the result back to your app.js script
        return {
            'statusCode': 200,
            'headers': { "Content-Type": "application/json" },
            'body': response.text # response.text is the JSON roadmap array
        }

    except Exception as e:
        # Log the error in the Netlify dashboard
        print(f"Error during roadmap generation: {e}")
        
        # Return a generic 500 status to the browser
        return {
            'statusCode': 500,
            'body': json.dumps({"error": "An internal server error occurred."})
        }
