import requests

API_URL = "http://127.0.0.1:8000/analyze"

payload = {
    "universe": "test",
    "scene_text": "Герой заходит в комнату и осматривается.",
    "scene_number": 1
}

response = requests.post(API_URL, json=payload)
print(response.json())
