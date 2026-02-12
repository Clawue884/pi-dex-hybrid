from core.types import Trade
from core.ledger import Ledger

class SettlementEngine:
    def __init__(self, ledger: Ledger):
        self.ledger = ledger

    def settle(self, trade: Trade):
        base, quote = trade.pair.split("/")

        if trade.side == "buy":
            self.ledger.apply(trade.user, quote, -trade.amount * trade.price)
            self.ledger.apply(trade.user, base, trade.amount)
        else:
            self.ledger.apply(trade.user, base, -trade.amount)
            self.ledger.apply(trade.user, quote, trade.amount * trade.price)

        return {"status": "SETTLED", "pair": trade.pair}
