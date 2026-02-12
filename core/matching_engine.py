import heapq

class MatchingEngine:
    def __init__(self, amm):
        self.buy_orders = []
        self.sell_orders = []
        self.amm = amm

    def place_order(self, side, price, amount):
        order = (price, amount)

        if side == "buy":
            heapq.heappush(self.buy_orders, (-price, amount))
        else:
            heapq.heappush(self.sell_orders, (price, amount))

        return self.match()

    def match(self):
        trades = []

        while self.buy_orders and self.sell_orders:
            best_buy = self.buy_orders[0]
            best_sell = self.sell_orders[0]

            if -best_buy[0] >= best_sell[0]:
                price = best_sell[0]
                amount = min(best_buy[1], best_sell[1])

                trades.append((price, amount))

                heapq.heappop(self.buy_orders)
                heapq.heappop(self.sell_orders)
            else:
                break

        if not trades:
            # fallback ke AMM
            price = self.amm.swap(1)
            trades.append(("AMM", price))

        return trades
