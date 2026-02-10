import axios from "axios";

export class PiChainService {
  private piApi = process.env.PI_API_URL || "https://api.minepi.com/v2";

  async submitTx(tx: any) {
    const res = await axios.post(`${this.piApi}/transactions`, tx, {
      headers: {
        Authorization: `Key ${process.env.PI_API_KEY}`,
      },
    });
    return res.data;
  }

  async getBalance(address: string) {
    const res = await axios.get(`${this.piApi}/accounts/${address}`);
    return res.data.balance;
  }

  async getTxStatus(txHash: string) {
    const res = await axios.get(`${this.piApi}/transactions/${txHash}`);
    return res.data;
  }
}
