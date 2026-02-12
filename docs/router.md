# 🧭 pi-dex-hybrid — Hybrid Router

---

## 1. Role

Hybrid Router adalah *brain layer*:

• Menerima user intent  
• Memvalidasi signature  
• Menentukan jalur terbaik  
• Mengirim ke engine yang tepat

---

## 2. Input Types

| Intent Type     | Route Target |
|-----------------|--------------|
| Market Swap     | AMM Engine   |
| Limit Order     | CLOB Adapter |
| Large Trade     | Split Route  |
| MM / AI Order   | CLOB → AMM   |

---

## 3. Smart Routing Logic

Router mempertimbangkan:

• Liquidity depth  
• Slippage tolerance  
• Order size  
• Volatility

---

## 4. Signature Validation

Setiap intent harus:

✔ Ditandatangani via Pi Wallet  
✔ Mengandung nonce  
✔ Timestamp bounded  
✔ Replay-safe

---

## 5. Output

Router menghasilkan:

• Execution intent  
• Route metadata  
• Settlement hint

---

Hybrid Router = **Intent → Optimal Execution**

© 2026 — pi-dex-hybrid / Clawue884
