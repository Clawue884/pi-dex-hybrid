# orderbook/ultra_engine.py
import heapq
import time

class UltraMatchingEngine:
    def __init__(self):
        self.bids = []  # max-heap
        self.asks = []  # min-heap

    def add_order(self, side, price, size, user):
        ts = time.time_ns()
        if side == "buy":
            heapq.heappush(self.bids, (-price, ts, size, user))
        else:
            heapq.heappush(self.asks, (price, ts, size, user))
        return self.match()

    def match(self):
        trades = []
        while self.bids and self.asks and -self.bids[0][0] >= self.asks[0][0]:
            bp, _, bs, bu = heapq.heappop(self.bids)
            ap, _, asz, au = heapq.heappop(self.asks)

            price = ap
            size = min(bs, asz)

            trades.append({
                "price": price,
                "size": size,
                "buyer": bu,
                "seller": au
            })

        return trades
