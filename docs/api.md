# 🌐 pi-dex-hybrid — API Specification

Base URL:

AMM API:
http://localhost:3001

Orderbook API:
http://localhost:8000

---

## 1. Authentication

Headers:

Authorization: Bearer <wallet_signature>
X-Nonce: <unique_nonce>
X-Timestamp: <unix_timestamp>

---

## 2. AMM Endpoints

POST /swap

Request:
{
  "tokenIn": "PI",
  "tokenOut": "USDT",
  "amountIn": "100",
  "slippage": "0.5"
}

Response:
{
  "amountOut": "99.12",
  "priceImpact": "0.02"
}

---

GET /pool/:pair

Response:
{
  "reserveA": "...",
  "reserveB": "...",
  "k": "..."
}

---

## 3. CLOB Endpoints

POST /order

{
  "pair": "PI/USDT",
  "side": "buy",
  "price": "1.20",
  "amount": "100"
}

---

GET /orderbook/:pair

Response:
{
  "bids": [],
  "asks": []
}

---

## 4. Settlement Endpoint

GET /ledger/state-root

Response:
{
  "blockHeight": 1203,
  "stateRoot": "0xabc123..."
}

---

## 5. WebSocket

ws://localhost:8000/ws

Streams:

• orderbook updates  
• trade execution  
• settlement events  
• new block  

---

API = **Secure Intent Interface to Hybrid Engine**

© 2026 — pi-dex-hybrid / Clawue884
