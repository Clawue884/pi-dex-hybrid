class ParallelMatcher:
    def __init__(self):
        self.bids = []
        self.asks = []

    def match(self):
        self.bids.sort(key=lambda x: -x["price"])
        self.asks.sort(key=lambda x: x["price"])

        trades = []
        while self.bids and self.asks:
            bid = self.bids[0]
            ask = self.asks[0]

            if bid["price"] >= ask["price"]:
                size = min(bid["amount"], ask["amount"])
                trades.append({
                    "price": ask["price"],
                    "amount": size
                })
                bid["amount"] -= size
                ask["amount"] -= size

                if bid["amount"] == 0: self.bids.pop(0)
                if ask["amount"] == 0: self.asks.pop(0)
            else:
                break

        return trades
