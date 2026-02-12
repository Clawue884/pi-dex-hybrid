# 🔐 pi-dex-hybrid — Security Model

---

## 1. Security Philosophy

Security adalah lapisan fundamental, bukan fitur tambahan.

Prinsip:

• Minimize trust  
• Deterministic validation  
• Explicit state transitions  
• Defense-in-depth  

---

## 2. Threat Model

Sistem dirancang untuk melindungi dari:

• Front-running  
• Sandwich attack  
• Replay attack  
• Double-spend attempt  
• Signature forgery  
• State desync  
• Malicious validator  

---

## 3. Signature Validation

Setiap intent harus:

✔ Signed via Pi Wallet  
✔ Contain nonce  
✔ Include timestamp  
✔ Domain-separated message hash  

Validation Rules:

- Nonce must be unique per wallet
- Timestamp within tolerance window
- Signature matches public key
- Chain ID included in hash

---

## 4. Anti-Replay Protection

Mechanism:

• Nonce per wallet  
• Nonce strictly incrementing  
• Used nonce stored in ledger  
• Expired timestamp rejected  

---

## 5. MEV Protection

• Batch-only settlement  
• No public mempool  
• Deterministic ordering  
• Proposer randomization  

---

## 6. Settlement Integrity

Before commit:

• Recalculate balances  
• Validate invariant (AMM x*y=k)  
• Validate CLOB fill correctness  
• Compute new state root  

---

## 7. Validator Security

Future-ready:

• Double-sign detection  
• Slashing conditions  
• Vote signature verification  
• Quorum enforcement (≥2/3)

---

## 8. Infrastructure Security

Production requirements:

• TLS everywhere  
• Rate limiting  
• WAF / DDoS mitigation  
• Container isolation  
• Secrets via env vault  

---

## 9. Audit Strategy

Stages:

1. Internal review  
2. Static analysis  
3. Third-party audit  
4. Bug bounty  

---

Security = **Predictable, Verifiable, Hardened**

© 2026 — pi-dex-hybrid / Clawue884
