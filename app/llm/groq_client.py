import os
from groq import Groq

MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def call_groq(prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=512
    )

    return response.choices[0].message.content.strip()
