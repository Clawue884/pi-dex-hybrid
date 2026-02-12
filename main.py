import time
import threading
from core.router import HybridRouter
from core.settlement import SettlementEngine
from core.ledger import Ledger
from core.types import Trade
from core.crypto import hash_entry
from worker.settlement_worker import SettlementWorker

queue = []
ledger = Ledger()
engine = SettlementEngine(ledger)
router = HybridRouter(queue)
worker = SettlementWorker(queue, engine)

threading.Thread(target=worker.run, daemon=True).start()

user = "pi_wallet_001"
msg = f"{user}:PI/USDT:buy:10:0.8:{time.time()}"
sig = hash_entry(msg)

trade = Trade(
    user=user,
    pair="PI/USDT",
    side="buy",
    amount=10,
    price=0.8,
    signature=sig
)

res = router.route_trade(trade, deadline=time.time()+60, slippage=0.01)
print("ROUTER:", res)

time.sleep(1)
print("LEDGER SYNC:\n", ledger.sync())
