import asyncio
import websockets
import json

clients = set()

async def handler(websocket):
    clients.add(websocket)
    try:
        async for message in websocket:
            pass
    finally:
        clients.remove(websocket)

async def broadcast(data):
    if clients:
        await asyncio.wait([c.send(json.dumps(data)) for c in clients])

async def start_server():
    server = await websockets.serve(handler, "0.0.0.0", 8765)
    print("WebSocket running on ws://0.0.0.0:8765")
    await server.wait_closed()
