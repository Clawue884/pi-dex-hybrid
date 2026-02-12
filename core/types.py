from dataclasses import dataclass
from typing import Dict
import time

@dataclass
class Trade:
    user: str
    pair: str
    side: str
    amount: float
    price: float
    signature: str
    timestamp: float = time.time()

@dataclass
class LedgerEntry:
    tx_id: str
    user: str
    asset: str
    delta: float
    nonce: int
    hash: str
