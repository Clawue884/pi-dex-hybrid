# 🔁 pi-dex-hybrid — Settlement Layer

---

## 1. Purpose

Settlement Layer adalah jantung finalitas di pi-dex-hybrid.  
Semua hasil eksekusi AMM & CLOB **harus lewat sini** sebelum masuk ledger.

Fungsi utama:

• Menyatukan hasil eksekusi  
• Menghilangkan MEV  
• Membuat urutan deterministik  
• Menghasilkan state final

---

## 2. Flow

AMM Engine ─┐ ├─> Settlement Worker ─> Batch Builder ─> Block Proposal CLOB Engine ┘

---

## 3. Batch Settlement

Order dikumpulkan per interval:

1. Collect execution results  
2. Sort deterministically  
3. Validate signatures  
4. Apply state transitions  
5. Produce settlement batch

---

## 4. Deterministic Ordering

Urutan tidak boleh dipengaruhi:

• Timestamp lokal  
• Node position  
• Network latency

Digunakan:

• Hash-based ordering  
• Canonical sort  
• zk-friendly sequence

---

## 5. MEV Guard

• No single-order execution  
• No mempool visibility  
• Batch-only commit  
• Intent anonymization

---

## 6. Output

Settlement menghasilkan:

✔ Block header  
✔ State delta  
✔ zk-ready transition proof  
✔ Ledger sync message

---

Settlement = **Execution → Truth**

© 2026 — pi-dex-hybrid / Clawue884
