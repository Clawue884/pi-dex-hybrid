// bridge/pi-native-bridge.ts
import { buildPiTx } from "./pi-tx-builder";
import { verifyQuorumSignatures } from "./validator-quorum";
import { submitToPiChain } from "./pi-anchor";

export async function bridgeBatchToPi({
  batchId,
  stateRoot,
  signatures,
  from,
  to,
  amount,
  asset,
  nonce
}: {
  batchId: string;
  stateRoot: string;
  signatures: { validatorId: string; sig: string }[];
  from: string;
  to: string;
  amount: number;
  asset: string;
  nonce: number;
}) {
  // 1️⃣ Verify quorum
  const ok = verifyQuorumSignatures(stateRoot, signatures, 3);
  if (!ok) throw new Error("❌ Quorum not reached");

  // 2️⃣ Build Pi anchor tx
  const tx = buildPiTx({
    from,
    to,
    amount,
    asset,
    stateRoot,
    batchId,
    nonce
  });

  // 3️⃣ Submit to Pi chain
  return submitToPiChain(tx);
}
