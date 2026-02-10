🚀 pi-dex-hybrid

> Hybrid DEX for Pi Network — Combining Uniswap‑style AMM with a Central Limit Order Book (CLOB) for pro‑grade liquidity, pricing, and execution.



  


---

✨ Vision

pi-dex-hybrid is an open‑source decentralized exchange designed for the Pi ecosystem. It merges:

🔁 AMM Pools for instant swaps & retail UX

📊 Orderbook Matching Engine for professional trading & price discovery


Built as a monorepo, the project is modular, scalable, and contribution‑friendly.


---

🧩 Architecture

pi-dex-hybrid/
├── backend-amm/        # NestJS – AMM Engine (x*y=k)
├── backend-orderbook/ # FastAPI – Matching Engine (CLOB)
├── frontend/          # React + Pi SDK UI
├── contracts/         # Smart contracts / Pi VM (placeholder)
├── docs/              # Whitepaper, specs, roadmap
└── .github/           # CI, templates, workflows

Flow:

1. Users connect via Pi Wallet (SDK)


2. Swaps go to AMM or Orderbook based on pair/size


3. Engines publish events via WebSocket


4. Frontend renders live markets




---

🛠 Tech Stack

Backend (AMM): NestJS, TypeScript, REST

Backend (CLOB): FastAPI, Python, WebSocket

Frontend: React, Vite/CRA, Pi SDK

Infra: Docker, GitHub Actions (CI)

Docs: Markdown



---

🚦 Status

> 🟢 Bootstrapping — core modules being initialized.



Planned milestones:

[x] Repo & license

[ ] README Pro

[ ] AMM Engine (NestJS)

[ ] Orderbook Engine (FastAPI)

[ ] React UI + Pi SDK

[ ] Mini Whitepaper



---

⚡ Getting Started (Local)

# clone
git clone https://github.com/Clawue884/pi-dex-hybrid.git
cd pi-dex-hybrid

# coming soon: docker compose


---

🤝 Contributing

We welcome all contributions!

1. Fork the repo


2. Create your feature branch (git checkout -b feat/my-feature)


3. Commit changes (git commit -m 'feat: add my feature')


4. Push (git push origin feat/my-feature)


5. Open a Pull Request




---

📜 License

MIT © Clawue884


---

🌍 Community

Ideas, issues, and PRs are welcome.

This project is community-driven for the Pi ecosystem.


> Build. Learn. Decentralize. 🚀
