import axios from "axios";

export class PiChainService {
  private base = process.env.PI_API_URL || "https://api.minepi.com/v2";
  private key = process.env.PI_API_KEY!;

  async submitPayment(payload: any) {
    const res = await axios.post(`${this.base}/payments`, payload, {
      headers: { Authorization: `Key ${this.key}` },
    });
    return res.data; // expect { identifier / paymentId, ... }
  }

  async approvePayment(paymentId: string) {
    const res = await axios.post(
      `${this.base}/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${this.key}` } }
    );
    return res.data;
  }

  async getPayment(paymentId: string) {
    const res = await axios.get(`${this.base}/payments/${paymentId}`, {
      headers: { Authorization: `Key ${this.key}` },
    });
    return res.data; // expect { status: "COMPLETED" | "PENDING" | ... }
  }
}
