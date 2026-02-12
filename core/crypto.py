import hashlib
import hmac

SECRET = b"PI-NETWORK-CORE-KEY"

def verify_signature(message: str, signature: str) -> bool:
    expected = hmac.new(SECRET, message.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)

def hash_entry(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()
