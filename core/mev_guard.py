import hashlib

class MEVGuard:
    def __init__(self):
        self.seen = set()

    def protect(self, tx):
        tx_hash = hashlib.sha256(str(tx).encode()).hexdigest()
        if tx_hash in self.seen:
            return False
        self.seen.add(tx_hash)
        return True
