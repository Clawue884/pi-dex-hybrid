import time
from core.settlement import SettlementEngine

class SettlementWorker:
    def __init__(self, queue, engine: SettlementEngine):
        self.queue = queue
        self.engine = engine

    def run(self):
        print("⚡ Settlement Worker running...")
        while True:
            if self.queue:
                trade = self.queue.pop(0)
                result = self.engine.settle(trade)
                print("✔", result)
            time.sleep(0.2)
