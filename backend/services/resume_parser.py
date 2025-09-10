from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from google.api_core.exceptions import ResourceExhausted
import re

# Initialize LLM lazily to avoid import-time errors
llm = None

def get_llm():
    global llm
    if llm is None:
        try:
            llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
        except Exception as e:
            print(f"Warning: Could not initialize Google Generative AI: {e}")
            # Return a mock LLM that returns a basic response
            class MockLLM:
                def invoke(self, messages):
                    return type('Response', (), {'content': 'Mock response - AI service unavailable'})()
            llm = MockLLM()
    return llm

def extract_resume_summary(cv_text: str) -> dict:
    """
    Extract structured summary (skills, education, projects, experience) from resume text.
    """
    # Truncate to keep token usage low
    truncated = cv_text[:4000]

    prompt = f"""
    Extract the following information from this resume:
    - Skills (list)
    - Education (degrees, universities, years if mentioned)
    - Work/Project Experience (short bullet summary)
    - Strengths or specialties

    Resume:
    {truncated}
    """
    try:
        llm_instance = get_llm()
        response = llm_instance.invoke([HumanMessage(content=prompt)])
        return {"summary": response.content}
    except ResourceExhausted:
        # Fallback: return a naive summary slice to keep flow working
        return {"summary": truncated[:800]}


def make_concise_summary(summary_text: str, max_chars: int = 800) -> str:
    """
    Compress a verbose summary into a short, precise version suitable for chat context.
    Target <= max_chars characters.
    """
    prompt = f"""
    Rewrite the following resume summary to be concise and precise (bullet points where helpful),
    focusing on core skills, domains, and outcomes. Target under {max_chars} characters.

    Summary:
    {summary_text[:4000]}
    """
    try:
        resp = llm.invoke([HumanMessage(content=prompt)])
        concise = resp.content.strip()
        return concise[:max_chars]
    except Exception:
        return summary_text[:max_chars]