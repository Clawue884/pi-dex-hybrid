from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from engine import MatchingEngine, Order
from ws import connect, disconnect, broadcast

app = FastAPI()
engine = MatchingEngine()

class OrderReq(BaseModel):
    side: str       # buy / sell
    price: float = 0
    amount: float
    type: str = "limit"  # limit / market

@app.post("/order")
async def order(req: OrderReq):
    order = Order(req.side, req.price, req.amount, req.type)
    trades = engine.submit(order)

    snap = engine.snapshot()
    await broadcast({"type": "orderbook", "data": snap})
    if trades:
        await broadcast({"type": "trades", "data": trades})

    return {"trades": trades}

@app.get("/metrics")
def metrics():
    s = engine.snapshot()
    return {
        "bids": len(s["bids"]),
        "asks": len(s["asks"]),
        "last_price": s["trades"][-1]["price"] if s["trades"] else None
    }

@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await connect(ws)
    try:
        while True:
            await ws.receive_text()
    except:
        await disconnect(ws)
