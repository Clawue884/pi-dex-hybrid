import time
from collections import deque

class Order:
    def __init__(self, side, price, amount):
        self.side = side
        self.price = price
        self.amount = amount
        self.timestamp = time.time()

class MatchingEngine:
    def __init__(self):
        self.bids = deque()
        self.asks = deque()
        self.trades = []

    def submit_order(self, order: Order):
        book = self.bids if order.side == "buy" else self.asks
        opp = self.asks if order.side == "buy" else self.bids

        trades = []
        while order.amount > 0 and opp:
            best = opp[0]
            if (order.side == "buy" and order.price >= best.price) or \
               (order.side == "sell" and order.price <= best.price):

                trade_amount = min(order.amount, best.amount)
                trade_price = best.price

                order.amount -= trade_amount
                best.amount -= trade_amount

                trades.append({
                    "price": trade_price,
                    "amount": trade_amount,
                    "side": order.side
                })

                if best.amount == 0:
                    opp.popleft()
            else:
                break

        if order.amount > 0:
            book.append(order)

        self.trades.extend(trades)
        return trades

    def snapshot(self):
        return {
            "bids": [[o.price, o.amount] for o in self.bids],
            "asks": [[o.price, o.amount] for o in self.asks],
            "trades": self.trades[-20:]
        }
