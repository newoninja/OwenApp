import json
import os
from google import genai
from google.genai import types

# GLOBAL DEFINITIONS
client = genai.Client()
SYSTEM_PROMPT = "You are a strategic AI Automation Consultant..." 


# HANDLER FUNCTION (Indentation is critical here)
def handler(event, context):
    # This line MUST be indented ONCE (4 spaces)
    print("DEBUG: API Key Check:", os.environ.get('GEMINI_API_KEY') is not None) 
    
    try:
        # These lines are indented TWICE (8 spaces, inside 'try')
        data = json.loads(event['body'])
        business = data.get('business', '')
        problem = data.get('problem', '')

        if not business or not problem:
            return {
                'statusCode': 400,
                'body': json.dumps({"error": "Missing input."})
            }

        query = f"Business/Industry: {business}. Key Problem: {problem}."
        
        # ... rest of the config and API call ...
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[query],
            config=config,
        )

        return {
            'statusCode': 200,
            'headers': { "Content-Type": "application/json" },
            'body': response.text
        }

    except Exception as e:
        # This line is indented ONCE (4 spaces, under 'except')
        print(f"Error during roadmap generation: {e}") 
        return {
            'statusCode': 500,
            'body': json.dumps({"error": "An internal server error occurred."})
        }
