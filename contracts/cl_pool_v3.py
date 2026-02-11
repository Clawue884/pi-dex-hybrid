# contracts/cl_pool_v3.py

from decimal import Decimal, getcontext
getcontext().prec = 42

class CLPoolV3:
    def __init__(self, token0, token1, fee=Decimal("0.003")):
        self.token0 = token0
        self.token1 = token1
        self.fee = fee
        self.liquidity_positions = []  # [{owner, lower, upper, liquidity}]
        self.sqrt_price = Decimal("1")

    def add_liquidity(self, owner, lower_tick, upper_tick, liquidity):
        assert lower_tick < upper_tick
        self.liquidity_positions.append({
            "owner": owner,
            "lower": lower_tick,
            "upper": upper_tick,
            "liquidity": Decimal(liquidity)
        })

    def _active_liquidity(self, tick):
        return sum(p["liquidity"] for p in self.liquidity_positions
                   if p["lower"] <= tick < p["upper"])

    def swap(self, amount_in, zero_for_one=True):
        amount_in = Decimal(amount_in)
        fee_amount = amount_in * self.fee
        amount_in_minus_fee = amount_in - fee_amount

        L = self._active_liquidity(tick=int(self.sqrt_price))
        assert L > 0, "No liquidity in range"

        if zero_for_one:
            amount_out = (L * amount_in_minus_fee) / (L + amount_in_minus_fee)
        else:
            amount_out = (L * amount_in_minus_fee) / (L + amount_in_minus_fee)

        return {
            "amount_in": amount_in,
            "fee": fee_amount,
            "amount_out": amount_out,
            "sqrt_price_after": self.sqrt_price
        }
