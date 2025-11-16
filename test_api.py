import requests
import json

# Test the backend API
url = "http://localhost:8000/api/contact"
data = {
    "name": "Test User",
    "email": "test@example.com",
    "project_type": "Web Development",
    "description": "This is a test submission"
}

print("Testing backend API...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data, indent=2)}")

try:
    response = requests.post(url, json=data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✅ SUCCESS! Backend API is working correctly.")
    else:
        print(f"\n❌ ERROR: Received status code {response.status_code}")
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
