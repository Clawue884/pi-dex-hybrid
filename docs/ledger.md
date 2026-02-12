# 📒 pi-dex-hybrid — Deterministic Ledger

---

## 1. Definition

Ledger di pi-dex-hybrid bukan database,  
tapi **deterministic state machine**.

Semua node harus bisa:

✔ Merekonstruksi state  
✔ Memverifikasi history  
✔ Sync tanpa trust

---

## 2. Structure

Ledger menyimpan:

• Block header  
• Settlement batch hash  
• State root  
• zk-proof

---

## 3. State Machine

Input = settlement batch  
Output = new state root

State transitions harus:

✔ Pure  
✔ Replayable  
✔ Deterministic

---

## 4. Sync Model

Node baru:

1. Download headers  
2. Verify zk-proofs  
3. Apply state deltas  
4. Rebuild full state

---

## 5. Consensus Link

Ledger terikat langsung ke:

• Consensus layer  
• Block proposer  
• Validator set

---

Ledger = **Verifiable Truth**

© 2026 — pi-dex-hybrid / Clawue884
