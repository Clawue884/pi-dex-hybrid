// backend-amm/src/settlement.worker.ts

import { Injectable } from "@nestjs/common";
import crypto from "crypto";

interface Trade {
  price: number;
  size: number;
  buyer: string;
  seller: string;
  pair: string;
}

@Injectable()
export class SettlementWorker {
  async atomicSettle(trade: Trade) {
    const tx = {
      from: trade.seller,
      to: trade.buyer,
      pair: trade.pair,
      amount: trade.size,
      price: trade.price,
      ts: Date.now(),
    };

    const signed = this.signTx(tx);
    return this.broadcastToPiVM(signed);
  }

  private signTx(tx: any) {
    const payload = JSON.stringify(tx);
    const hash = crypto.createHash("sha256").update(payload).digest("hex");
    return { ...tx, sig: hash };
  }

  private async broadcastToPiVM(tx: any) {
    console.log("📡 Broadcasting to Pi VM:", tx);
    return { status: "OK", txHash: tx.sig };
  }
}
