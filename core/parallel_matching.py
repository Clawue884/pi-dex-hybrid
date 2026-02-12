import threading
from queue import Queue

class ParallelMatchingEngine:
    def __init__(self):
        self.queue = Queue()
        self.trades = []

    def submit(self, order):
        self.queue.put(order)

    def worker(self):
        while True:
            order = self.queue.get()
            if order is None:
                break
            self.match(order)
            self.queue.task_done()

    def match(self, order):
        # deterministic placeholder logic
        trade = {
            "pair": order["pair"],
            "price": order["price"],
            "amount": order["amount"],
            "side": order["side"]
        }
        self.trades.append(trade)

    def start(self, workers=4):
        for _ in range(workers):
            threading.Thread(target=self.worker, daemon=True).start()
