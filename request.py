import requests
url = "http://localhost:3002/generate"
req = {
        "prompt": "List the first 15 prime numbers"
}

x = requests.post(url, json = req)
jsonF = x.json()
print(jsonF["response"])
