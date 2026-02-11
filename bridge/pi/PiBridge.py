contract PiBridge {

    // ====== STORAGE ======
    storage {
        map lockedBalance: Address => u128
        map usedProofs: Hash => bool
        address admin
    }

    // ====== EVENTS ======
    event Locked(sender: Address, amount: u128, targetChain: String, targetAddress: String, nonce: u64)
    event Unlocked(receiver: Address, amount: u128, evmTxHash: Hash)

    // ====== INIT ======
    fn init() {
        admin = msg.sender
    }

    // ====== LOCK PI → EVM ======
    fn lock(amount: u128, targetChain: String, targetAddress: String, nonce: u64) {
        require(balance_of(msg.sender) >= amount, "Insufficient Pi")

        // Transfer Pi from user to bridge
        transfer_from(msg.sender, self.address, amount)
        lockedBalance[msg.sender] += amount

        emit Locked(msg.sender, amount, targetChain, targetAddress, nonce)
    }

    // ====== UNLOCK PI ← EVM ======
    fn unlock(
        receiver: Address,
        amount: u128,
        evmTxHash: Hash,
        proof: Bytes
    ) {
        require(!usedProofs[evmTxHash], "Proof already used")

        // Verify EVM tx proof via Pi light-client
        let valid = verify_evm_tx_proof(evmTxHash, proof)
        require(valid, "Invalid EVM proof")

        usedProofs[evmTxHash] = true
        transfer(receiver, amount)

        emit Unlocked(receiver, amount, evmTxHash)
    }

    // ====== INTERNAL: EVM PROOF VERIFIER ======
    fn verify_evm_tx_proof(txHash: Hash, proof: Bytes) -> bool {
        // Placeholder for:
        // - Header verification
        // - Merkle Patricia Trie proof
        // - Finality check
        return LightClient.verify(txHash, proof)
    }
}
