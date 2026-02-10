from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

orderbook = {
    "PI/USDT": {
        "bids": [[0.99, 1000], [0.98, 2000]],
        "asks": [[1.01, 1500], [1.02, 3000]],
    }
}

class QuoteRequest(BaseModel):
    tokenIn: str
    tokenOut: str
    amountIn: float

@app.post("/quote")
def quote(req: QuoteRequest):
    pair = f"{req.tokenIn}/{req.tokenOut}"
    ob = orderbook.get(pair)
    if not ob:
        return {"amountOut": 0, "price": 0}

    best_ask = ob["asks"][0]
    price = best_ask[0]
    amount_out = req.amountIn / price
    return {"amountOut": amount_out, "price": price}

@app.get("/orderbook/{pair}")
def get_orderbook(pair: str):
    return orderbook.get(pair, {})
