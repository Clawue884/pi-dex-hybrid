# 🧠 pi-dex-hybrid — System Architecture

Hybrid DEX for Pi Network  
Combining AMM + CLOB-style Execution + Deterministic Settlement

---

## 🎯 Design Philosophy

pi-dex-hybrid tidak membangun “exchange tradisional”,  
melainkan **future-grade decentralized execution network** untuk ekosistem Pi.

Prinsip utama:

• ⚡ Fast Execution (off-chain engines)  
• 🔒 Deterministic Settlement (on-chain / ledger layer)  
• 🧬 zk-State Compression  
• 🧠 AI + Parallel Matching  
• 🧱 Modular & Upgradeable

---

## 🧩 High-Level Architecture


┌────────────────────────────┐ │        Pi Wallet SDK       │ │   (User Auth + Signature)  │ └─────────────┬──────────────┘ │ ▼ ┌────────────────┐ │  Hybrid Router │ │ (Intent Router │ │  + Smart Flow) │ └───────┬────────┘ │ ┌─────────┴─────────┐ ▼                   ▼ ┌────────────┐   ┌────────────┐ │  AMM Engine │   │ CLOB Adapter│ │ (x*y=k +    │   │ (Limit Book │ │  V3 CLP)    │   │  Execution) │ └──────┬──────┘   └──────┬──────┘ │                 │ └──────┬──────────┘ ▼ ┌─────────────────────┐ │  Batch Settlement   │ │   + MEV Guard       │ └─────────┬───────────┘ ▼ ┌─────────────────────┐ │ Deterministic Ledger│ │ + zk-State Sync     │ └─────────────────────┘


---

## 🧠 Position of CLOB in pi-dex-hybrid

Folder / module `clob/` **BUKAN** sistem exchange lama.

CLOB di pi-dex-hybrid berfungsi sebagai:

✔ Execution Adapter  
✔ Price Discovery Engine  
✔ Limit Order Support Layer  
✔ AI / Bot / MM Interface  

Bukan sebagai:

❌ Final Ledger  
❌ Source of Truth  
❌ Settlement Authority

> Final truth tetap ada di:
> **Deterministic Ledger + Settlement Worker + zk-State Sync**

---

## ⚙️ Hybrid Router

Hybrid Router adalah otak sistem:

Fungsi:

• Menerima intent user  
• Mendeteksi tipe order  
• Memilih jalur terbaik:
  - AMM
  - CLOB
  - Hybrid split

Contoh logika:

| Order Type       | Routed To     |
|------------------|---------------|
| Instant Swap     | AMM           |
| Limit Order      | CLOB Adapter  |
| Large Trade      | Split Route   |
| AI/MM Order      | CLOB → AMM    |

---

## 🔁 Batch Settlement Worker

Fungsi:

• Menggabungkan hasil AMM + CLOB  
• Menghapus MEV / sandwich  
• Membuat block settlement  
• Menyinkronkan ke ledger

Fitur:

• Deterministic ordering  
• zk-State compression  
• Parallel validation  
• Anti-front-run

---

## 🔒 Deterministic Ledger

Ledger layer adalah *source of truth*.

Karakteristik:

✔ Deterministic state  
✔ Verifiable sync  
✔ zk-proof friendly  
✔ Consensus ready (RAFT / Tendermint-style)

Ledger ini bukan sekadar database,  
tapi **state machine yang bisa direkonstruksi di semua node.**

---

## 🧬 zk-State Compression

Tujuan:

• Mengurangi ukuran state  
• Mempercepat sync  
• Menjamin integritas

Proses:

1. Settlement batch → state delta  
2. Delta → zk-proof  
3. Proof → ledger sync  
4. Node → verify → apply

---

## 🛡 MEV Protection Layer

pi-dex-hybrid melindungi user dari:

• Sandwich attack  
• Backrunning  
• Front-running

Dengan:

✔ Batch execution  
✔ Intent anonymization  
✔ Deterministic ordering  
✔ Randomized block proposer

---

## 🚀 Why CLOB Still Exists in a Pi-Future System?

Karena:

• Market profesional perlu limit orders  
• Price discovery perlu depth book  
• AI/MM perlu struktur market

Tapi:

➡️ CLOB hanya *execution engine*  
➡️ Bukan ledger  
➡️ Bukan final state  

> pi-dex-hybrid =  
> **DEX Masa Depan dengan Eksekusi Modern + Settlement Deterministik**

---

## 🧑‍💻 Modular & Upgradeable

Setiap komponen bisa diganti:

• AMM → V3 / CLP  
• CLOB → Parallel / AI-based  
• Settlement → zk-rollup  
• Ledger → Tendermint / Pi VM

---

## 📌 Summary

CLOB di pi-dex-hybrid:

✔ Dipakai  
✔ Tapi tidak jadi pusat sistem  

Pusat sistem adalah:

> 🔒 Deterministic Ledger + Settlement + zk-State Sync

---

Build. Learn. Decentralize. 🚀  
© 2026 — pi-dex-hybrid / Clawue884
