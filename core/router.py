import time
from core.crypto import verify_signature
from core.types import Trade

class HybridRouter:
    def __init__(self, settlement_queue):
        self.queue = settlement_queue

    def route_trade(self, trade: Trade, deadline: float, slippage: float):
        now = time.time()
        if now > deadline:
            raise Exception("Trade expired")

        msg = f"{trade.user}:{trade.pair}:{trade.side}:{trade.amount}:{trade.price}:{trade.timestamp}"
        if not verify_signature(msg, trade.signature):
            raise Exception("Invalid wallet signature")

        trade.price *= (1 - slippage if trade.side == "buy" else 1 + slippage)
        self.queue.append(trade)
        return {"status": "ROUTED", "final_price": trade.price}
