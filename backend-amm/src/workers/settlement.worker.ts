import axios from "axios";

export class SettlementWorker {
  async settleTrade(trade: any) {
    const payload = {
      amount: trade.amount,
      memo: `pi-dex-hybrid trade ${trade.id}`,
      metadata: { pair: trade.pair },
    };

    const res = await axios.post(
      "https://api.minepi.com/v2/payments",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
        },
      }
    );

    return {
      tradeId: trade.id,
      payment: res.data,
      status: "SETTLED",
    };
  }
}
