from fastapi import WebSocket

clients = set()

async def connect(ws: WebSocket):
    await ws.accept()
    clients.add(ws)

async def disconnect(ws: WebSocket):
    clients.remove(ws)

async def broadcast(data):
    for ws in list(clients):
        await ws.send_json(data)
