# 🔗 pi-dex-hybrid — Deterministic Consensus

---

## 1. Philosophy

Ledger bukan database biasa, tapi **state machine deterministik**.  
Semua node harus sampai pada state yang sama dari input yang sama.

---

## 2. Consensus Model

Model hybrid:

• RAFT-style leader election  
• Tendermint-style BFT finality  

---

## 3. Flow

1. Settlement batch dibuat  
2. Proposer mengusulkan block  
3. Validator memverifikasi  
4. Commit jika ≥2/3 setuju  

---

## 4. Properties

✔ Deterministic ordering  
✔ Byzantine fault tolerance  
✔ Fast finality  
✔ Replayable state

---

## 5. Roles

• Proposer  
• Validator  
• Observer  

---

## 6. Security

• Slashing (future)  
• Double-sign detection  
• zk-proof verification  

---

Consensus di pi-dex-hybrid memastikan:
> **State = Verifiable + Final + Deterministic**

© 2026 — pi-dex-hybrid / Clawue884
