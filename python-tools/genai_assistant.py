import os
import google.generativeai as genai
import argparse

def main():
    parser = argparse.ArgumentParser(description="GPW Generative AI Assistant using Google Python SDK")
    parser.add_argument("prompt", type=str, help="The prompt to send to the AI")
    parser.add_argument("--model", type=str, default="gemini-1.5-flash", help="The model to use")

    args = parser.parse_args()

    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("Error: GOOGLE_API_KEY environment variable not set.")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(args.model)

    response = model.generate_content(args.prompt)
    print(response.text)

if __name__ == "__main__":
    main()
