// bridge/pi-anchor.ts
import { PiTx } from "./pi-tx-builder";

export async function submitToPiChain(tx: PiTx) {
  console.log("⛓ Submitting Pi Anchor Tx:", tx);

  // TODO: Integrasi Pi SDK resmi
  // await PiSDK.submitTransaction(tx)

  return {
    txid: "PI_ANCHOR_" + Date.now(),
    status: "submitted"
  };
}
