from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from engine import MatchingEngine, Order
from ws import connect, disconnect, broadcast

app = FastAPI()
engine = MatchingEngine()

class OrderRequest(BaseModel):
    side: str   # buy / sell
    price: float
    amount: float

@app.post("/order")
async def submit(req: OrderRequest):
    order = Order(req.side, req.price, req.amount)
    trades = engine.submit_order(order)

    snap = engine.snapshot()
    await broadcast({"type": "orderbook", "data": snap})
    if trades:
        await broadcast({"type": "trades", "data": trades})

    return {"status": "ok", "trades": trades}

@app.get("/book")
def book():
    return engine.snapshot()

@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await connect(ws)
    try:
        while True:
            await ws.receive_text()
    except:
        await disconnect(ws)
