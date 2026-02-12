import math

class LiquidityPosition:
    def __init__(self, owner, lower_tick, upper_tick, liquidity):
        self.owner = owner
        self.lower_tick = lower_tick
        self.upper_tick = upper_tick
        self.liquidity = liquidity


class ConcentratedAMM:
    def __init__(self, initial_price):
        self.sqrt_price = math.sqrt(initial_price)
        self.positions = []
        self.current_tick = int(initial_price * 100)

    def add_liquidity(self, owner, lower_price, upper_price, amount):
        lower_tick = int(lower_price * 100)
        upper_tick = int(upper_price * 100)
        position = LiquidityPosition(owner, lower_tick, upper_tick, amount)
        self.positions.append(position)

    def active_liquidity(self):
        total = 0
        for p in self.positions:
            if p.lower_tick <= self.current_tick <= p.upper_tick:
                total += p.liquidity
        return total

    def swap(self, amount_in):
        L = self.active_liquidity()
        if L == 0:
            raise Exception("No active liquidity")

        price_impact = amount_in / L
        self.sqrt_price += price_impact
        self.current_tick = int((self.sqrt_price ** 2) * 100)

        return self.sqrt_price ** 2
