import time
from collections import deque

FEE_RATE = 0.001  # 0.1%

class Order:
    def __init__(self, side, price, amount, order_type="limit"):
        self.side = side
        self.price = price
        self.amount = amount
        self.type = order_type
        self.timestamp = time.time()

class MatchingEngine:
    def __init__(self):
        self.bids = deque()
        self.asks = deque()
        self.trades = []

    def submit(self, order: Order):
        book = self.bids if order.side == "buy" else self.asks
        opp = self.asks if order.side == "buy" else self.bids
        trades = []

        while order.amount > 0 and opp:
            best = opp[0]
            price_ok = order.type == "market" or \
                (order.side == "buy" and order.price >= best.price) or \
                (order.side == "sell" and order.price <= best.price)

            if not price_ok:
                break

            trade_amt = min(order.amount, best.amount)
            trade_price = best.price
            fee = trade_amt * FEE_RATE

            order.amount -= trade_amt
            best.amount -= trade_amt

            trade = {
                "price": trade_price,
                "amount": trade_amt - fee,
                "fee": fee,
                "side": order.side,
                "ts": time.time()
            }
            trades.append(trade)

            if best.amount == 0:
                opp.popleft()

        if order.amount > 0 and order.type == "limit":
            book.append(order)

        self.trades.extend(trades)
        return trades

    def snapshot(self):
        return {
            "bids": [[o.price, o.amount] for o in self.bids],
            "asks": [[o.price, o.amount] for o in self.asks],
            "trades": self.trades[-30:]
        }
