import requests
import os

PI_API_URL = os.getenv("PI_API_URL", "https://api.minepi.com/v2")
PI_API_KEY = os.getenv("PI_API_KEY")

HEADERS = {
    "Authorization": f"Key {PI_API_KEY}"
}

def submit_tx(tx: dict):
    res = requests.post(f"{PI_API_URL}/transactions", json=tx, headers=HEADERS)
    return res.json()

def get_balance(address: str):
    res = requests.get(f"{PI_API_URL}/accounts/{address}", headers=HEADERS)
    return res.json()

def get_tx_status(tx_hash: str):
    res = requests.get(f"{PI_API_URL}/transactions/{tx_hash}", headers=HEADERS)
    return res.json()
