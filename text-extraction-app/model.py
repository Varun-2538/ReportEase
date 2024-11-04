# Import necessary libraries
from openai import OpenAI
import os
from dotenv import load_dotenv  # type: ignore
import json
import re
import fitz

# Load environment variables
load_dotenv()
print("Environment Keys Loaded:", os.getenv("OPENAI_API_KEY"))

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OpenAI API Key not set in environment variable")
client = OpenAI(api_key=api_key)


def extract_text_from_pdf(pdf_path):
    """
    Extracts all text from the PDF file located at pdf_path.
    """
    text = ""
    try:
        with fitz.open(pdf_path) as pdf:
            for page_num in range(pdf.page_count):
                page = pdf[page_num]
                text += page.get_text()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return text

system_context_prompt = (
    "You are an experienced legal professional with specialized expertise in Indian criminal law "
    "and procedural jurisprudence. Your knowledge base includes the Bharatiya Nyaya Sanhita (BNS), 2023, "
    "and the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023. Relevant sections from these legal codes "
    "are included below for your reference.\n\n"
    
    "Refer to these sections to provide accurate, detailed legal analyses. When analyzing cases, "
    "identify and cite specific sections that are most relevant to the user's prompt and provide "
    "a legal explanation based on these documents. Explain the legal reasoning behind each section's applicability, "
    "considering both substantive and procedural aspects. If recent amendments or judicial interpretations "
    "are available in the provided context, include those as well.\n\n"
    
    "Use professional ethics by:\n"
    "- Acknowledging limitations in complex scenarios\n"
    "- Suggesting consultation with practicing advocates when necessary\n"
    "- Avoiding definitive conclusions without complete facts\n"
    "- Considering constitutional rights and principles\n\n"
    
    "For each analysis, provide:\n"
    "- 4 applicable Sections from the Bharatiya Nyaya Sanhita\n"
    "- 2 relevant procedural sections from the Bharatiya Nagarik Suraksha Sanhita\n"
    "- Clear reasoning for each section's applicability\n"
    "- Potential procedural requirements or limitations\n\n"
    
    "End each response with: 'I recommend further investigation of the case to cross-check my suggestions.'\n\n"
    
    "Legal References:\n"  # Here, the extracted PDF text can be appended
)

def format_prompt_for_model(user_prompt):
    messages = [
        {"role": "system", "content": system_context_prompt},
        {"role": "user", "content": user_prompt},
    ]

    return messages

def generate_legal_suggestions(
    prompt,
    pdf_path="resources/a2023-45.pdf",
    creativity_level=0.2,
    max_tokens_to_generate=1024,
    top_p_filtering_ratio=0.96,
    model="gpt-4o-mini"
):
    # Extract text from the PDF
    pdf_text = extract_text_from_pdf(pdf_path)
    
    # Append PDF text to the system context
    system_context_prompt_with_pdf = system_context_prompt + "\n\n" + pdf_text

    # Format messages for the chat completion
    messages = [
        {"role": "system", "content": system_context_prompt_with_pdf},
        {"role": "user", "content": prompt}
    ]
    
    # Create the chat completion with OpenAI
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=creativity_level,
            max_tokens=max_tokens_to_generate,
            top_p=top_p_filtering_ratio,
            presence_penalty=0,
            frequency_penalty=0
        )
        
        # Extract the generated text from the response
        final_output_text = response.choices[0].message.content
        
        return final_output_text
        
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return None

