import { EventBus } from "../events/event.bus";
import { PiChainService } from "../services/pi-chain.service";

type Trade = {
  id: string;
  pair: string;
  maker: string;
  taker: string;
  amount: number;
  price: number;
};

type SettlementResult = {
  tradeId: string;
  paymentId: string;
  status: "SUBMITTED" | "APPROVED" | "CONFIRMED" | "FAILED";
};

export class SettlementWorker {
  private pi = new PiChainService();
  private pollingMs = 3000;
  private maxTries = 20;

  constructor() {
    EventBus.on("trade:matched", (trade: Trade) => {
      this.handleTrade(trade).catch(console.error);
    });
  }

  async handleTrade(trade: Trade) {
    // 1) Submit payment (create)
    const value = trade.amount * trade.price;
    const payload = {
      amount: value,
      memo: `pi-dex-hybrid trade ${trade.id}`,
      metadata: { pair: trade.pair, maker: trade.maker, taker: trade.taker },
    };

    const created = await this.pi.submitPayment(payload);
    const paymentId = created.identifier || created.paymentId;

    let result: SettlementResult = {
      tradeId: trade.id,
      paymentId,
      status: "SUBMITTED",
    };
    EventBus.emit("trade:settled", result);

    // 2) Approve on server
    await this.pi.approvePayment(paymentId);
    result = { ...result, status: "APPROVED" };
    EventBus.emit("trade:settled", result);

    // 3) Poll confirmation
    for (let i = 0; i < this.maxTries; i++) {
      await this.sleep(this.pollingMs);
      const info = await this.pi.getPayment(paymentId);

      if (info.status === "COMPLETED") {
        result = { ...result, status: "CONFIRMED" };
        EventBus.emit("trade:settled", result);
        return;
      }

      if (info.status === "FAILED" || info.status === "CANCELLED") {
        result = { ...result, status: "FAILED" };
        EventBus.emit("trade:settled", result);
        return;
      }
    }

    // timeout
    result = { ...result, status: "FAILED" };
    EventBus.emit("trade:settled", result);
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
