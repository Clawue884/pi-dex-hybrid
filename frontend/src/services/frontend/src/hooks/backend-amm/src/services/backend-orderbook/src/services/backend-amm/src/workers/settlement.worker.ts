import { PiChainService } from "../services/pi-chain.service";

export class SettlementWorker {
  private piChain = new PiChainService();

  async settleTrade(trade: any) {
    const txPayload = {
      from: trade.maker,
      to: trade.taker,
      amount: trade.amount,
      memo: `pi-dex-hybrid trade ${trade.id}`,
    };

    const result = await this.piChain.submitTx(txPayload);

    return {
      tradeId: trade.id,
      txHash: result.tx_hash,
      status: "SUBMITTED",
    };
  }
}
