contract PiLightClient {

    // ===== STORAGE =====
    storage {
        map finalizedHeaders: Hash => bool
        map headerRoots: Hash => Hash
        u64 minConfirmations
        address admin
    }

    // ===== EVENTS =====
    event HeaderSubmitted(headerHash: Hash, stateRoot: Hash, height: u64)
    event Finalized(headerHash: Hash)

    // ===== INIT =====
    fn init(confirmations: u64) {
        admin = msg.sender
        minConfirmations = confirmations
    }

    // ===== SUBMIT HEADER (FROM RELAYER) =====
    fn submitHeader(
        headerHash: Hash,
        stateRoot: Hash,
        height: u64
    ) {
        require(msg.sender == admin, "not authorized")

        headerRoots[headerHash] = stateRoot
        emit HeaderSubmitted(headerHash, stateRoot, height)

        if height >= minConfirmations {
            finalizedHeaders[headerHash] = true
            emit Finalized(headerHash)
        }
    }

    // ===== VERIFY EVM TX PROOF =====
    fn verifyTxProof(
        headerHash: Hash,
        txHash: Hash,
        merkleProof: Bytes
    ) -> bool {
        require(finalizedHeaders[headerHash], "header not final")

        let root = headerRoots[headerHash]
        return Merkle.verify(txHash, merkleProof, root)
    }

    // ===== INTERNAL MERKLE =====
    module Merkle {
        fn verify(leaf: Hash, proof: Bytes, root: Hash) -> bool {
            let computed = leaf
            for p in proof {
                computed = hash_pair(computed, p)
            }
            return computed == root
        }
    }
}
