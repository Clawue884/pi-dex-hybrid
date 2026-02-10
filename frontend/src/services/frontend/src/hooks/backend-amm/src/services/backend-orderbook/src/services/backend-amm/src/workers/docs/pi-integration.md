# Pi Network Integration – pi-dex-hybrid

## Flow
1. User login via Pi SDK (Frontend)
2. Order / Swap dibuat di UI
3. Backend matching engine proses order
4. Settlement Worker kirim tx ke Pi Chain
5. Konfirmasi → Emit WebSocket ke UI

## Components
- Pi SDK (Auth + Payment)
- AMM Engine (NestJS)
- Orderbook Engine (FastAPI)
- Settlement Worker
- Pi Chain API Layer

## Status
Smart contract layer prepared, pending Pi Open Mainnet VM support.
