import hashlib
import json

class NodeSync:
    def __init__(self):
        self.peers = []

    def calculate_hash(self, state):
        return hashlib.sha256(json.dumps(state).encode()).hexdigest()

    def sync(self, local_state, remote_state):
        local_hash = self.calculate_hash(local_state)
        remote_hash = self.calculate_hash(remote_state)

        if local_hash != remote_hash:
            return "STATE_MISMATCH"
        return "SYNC_OK"
