
# 🚀 pi-dex-hybrid

Hybrid DEX for Pi Network — Combining Uniswap-style AMM with a Central Limit Order Book (CLOB) for pro-grade liquidity, pricing, and execution.

---

## ✨ Vision

**pi-dex-hybrid** is an open-source decentralized exchange designed for the Pi ecosystem.  
It merges:

- 🔁 **AMM Pools** for instant swaps & retail UX  
- 📊 **Orderbook Matching Engine (CLOB)** for professional trading & price discovery  

Built as a **monorepo**, modular, scalable, and contribution-friendly.

---

## 🧩 Architecture
pi-dex-hybrid/ ├── backend-amm/        # NestJS – AMM Engine (x*y=k) ├── orderbook/          # FastAPI – Matching Engine (CLOB) ├── frontend/           # React + Pi SDK UI ├── contracts/          # Smart contracts / Pi VM (placeholder) ├── deploy/             # Production Docker + Nginx ├── docs/               # Whitepaper, specs, roadmap └── .github/            # CI, templates, workflows
Salin kode

### Flow

1. Users connect via **Pi Wallet (SDK)**  
2. Orders routed to **AMM** or **Orderbook**  
3. Engines publish events via **WebSocket**  
4. Frontend renders **live markets**

---

## 🛠 Tech Stack

- **Backend (AMM)**: NestJS, TypeScript  
- **Backend (CLOB)**: FastAPI, Python, WebSocket  
- **Frontend**: React, Vite, Pi SDK  
- **Infra**: Docker, Nginx, GitHub Actions  
- **Docs**: Markdown  

---

## 🚦 Status

🟢 Bootstrapping — core modules being initialized.

Planned milestones:

- [x] Repo & License  
- [x] README Pro  
- [ ] AMM Engine (NestJS)  
- [ ] Orderbook Engine (FastAPI)  
- [ ] React UI + Pi SDK  
- [ ] Mini Whitepaper  

---

## ⚡ Run Locally (Dev)

```bash
git clone https://github.com/Clawue884/pi-dex-hybrid.git
cd pi-dex-hybrid
docker compose up --build
App will run on:
Frontend → http://localhost:5173
AMM API → http://localhost:3001
Orderbook → http://localhost:8000

🌍 Deploy to Production (VPS)
 Server Setup
On your VPS (DigitalOcean / Hetzner / Ubuntu):
sudo apt update && sudo apt install docker docker-compose -y

 Clone Repo
git clone https://github.com/Clawue884/pi-dex-hybrid.git
cd pi-dex-hybrid/deploy

 Setup Environment
Create .env.prod (DO NOT COMMIT):
NODE_ENV=production
PI_NETWORK=mainnet
PI_APP_ID=your_real_pi_app_id_here
4️⃣ Run Production Stack
docker compose -f docker-compose.prod.yml up -d --build

🌐 Domains
Recommended DNS setup:
Service
Domain
Frontend
https://dex.pi-hybrid.org
API
https://api.pi-hybrid.org

🤝 Contributing
Fork the repo
Create feature branch
git checkout -b feat/my-feature
Commit changes
git commit -m "feat: add my feature"
Push
git push origin feat/my-feature
Open Pull Request

📜 License
MIT © Clawue884

🌍 Community
Ideas, issues, and PRs are welcome.
This project is community-driven for the Pi ecosystem.
Build. Learn. Decentralize. 🚀
