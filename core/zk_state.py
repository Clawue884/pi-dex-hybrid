import hashlib

class ZKState:
    def __init__(self):
        self.state = []

    def append(self, data):
        self.state.append(data)

    def compress(self):
        root = hashlib.sha256("".join(map(str, self.state)).encode()).hexdigest()
        proof = hashlib.sha256(root.encode()).hexdigest()
        return {"state_root": root, "zk_proof": proof}
