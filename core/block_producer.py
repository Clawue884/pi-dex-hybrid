import time
import hashlib

class BlockProducer:
    def __init__(self):
        self.blocks = []

    def produce(self, batch, state_root):
        block = {
            "height": len(self.blocks) + 1,
            "time": int(time.time()),
            "txs": batch,
            "state_root": state_root
        }
        block["hash"] = hashlib.sha256(str(block).encode()).hexdigest()
        self.blocks.append(block)
        return block
