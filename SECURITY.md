# 🔐 Security Policy — pi-dex-hybrid

Thank you for helping keep **pi-dex-hybrid** and its users safe.  
We take security seriously and appreciate responsible disclosure.

---

## 📣 Reporting a Vulnerability

If you discover a security issue, please **do not** open a public GitHub issue.

Instead, report it privately via:

📧 **security@pi-hybrid.org**  
(Replace with your real security contact email)

Include as much detail as possible:

- Description of the vulnerability
- Steps to reproduce
- Affected components / files
- Potential impact
- Proof of concept (if available)

We will respond as quickly as possible and work with you on a fix.

---

## 🛡️ Scope

This policy applies to:

- AMM Engine (NestJS / TypeScript)
- Orderbook Engine (FastAPI / Python)
- Settlement Workers
- API layer & WebSocket
- Frontend (React + Pi SDK)
- Docker / Nginx / Deployment configs

---

## 🚫 Out of Scope

The following are typically out of scope:

- DoS attacks via traffic flooding
- Social engineering
- Physical attacks
- Issues in third-party dependencies unless directly exploitable

---

## ⏱️ Disclosure Timeline

We aim to:

- Acknowledge reports within **72 hours**
- Provide a fix or mitigation within **14–30 days**, depending on severity
- Coordinate disclosure after patching

---

## 🧪 Security Practices

- No private keys stored in the repository
- Wallet signing handled client-side (Pi Wallet SDK)
- Secrets managed via environment variables
- Modular containerized architecture
- Planned: audits, fuzzing, and test coverage

---

## 🏅 Credit

We appreciate responsible disclosure.  
Valid reports may be credited in release notes or documentation (with your permission).

---

## ⚖️ Legal Safe Harbor

We support good-faith security research.  
If you follow this policy, we will not pursue legal action against you.

---

Security is a shared responsibility.  
**Build safe. Trade smart. Decentralize responsibly. 🔐**
