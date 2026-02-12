# Changelog

All notable changes to this project will be documented in this file.

This project follows Semantic Versioning (SemVer).

---

## [0.1.0-alpha] - 2026-02-12

### Added
- Deterministic ledger engine
- Hybrid Router (AMM + CLOB architecture-ready)
- Parallel matching engine skeleton
- MEV Guard batch processor
- zk-rollup state aggregator (root hashing)
- Validator staking module
- Slashing logic
- P2P gossip network skeleton
- Encrypted intent mempool structure
- RAFT-style consensus loop (experimental)
- Tendermint-style block finalization simulation
- Pi-native bridge anchor logic
- Multi-validator signature verification
- Security documentation
- Governance draft (DAO + fee model)
- Tokenomics draft

### Security
- Nonce protection added
- Signature verification enforcement
- Deterministic state hashing for replay prevention

### Notes
- Alpha release
- Not production-ready
- zk proofs currently stubbed (no real prover integration)
