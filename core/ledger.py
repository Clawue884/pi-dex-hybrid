import json
from core.crypto import hash_entry
from core.types import LedgerEntry

class Ledger:
    def __init__(self):
        self.state = {}
        self.entries = []
        self.nonce = 0

    def apply(self, user: str, asset: str, delta: float):
        self.state.setdefault(user, {})
        self.state[user][asset] = self.state[user].get(asset, 0) + delta

        raw = f"{user}:{asset}:{delta}:{self.nonce}"
        entry_hash = hash_entry(raw)
        entry = LedgerEntry(
            tx_id=entry_hash,
            user=user,
            asset=asset,
            delta=delta,
            nonce=self.nonce,
            hash=entry_hash
        )
        self.entries.append(entry)
        self.nonce += 1

    def sync(self):
        snapshot = {
            "state": self.state,
            "entries": [e.__dict__ for e in self.entries]
        }
        return json.dumps(snapshot, indent=2)
