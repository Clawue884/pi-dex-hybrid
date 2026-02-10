import { Controller, Post, Body } from "@nestjs/common";
import axios from "axios";

@Controller("pi")
export class PiPaymentController {
  @Post("approve-payment")
  async approve(@Body() body: any) {
    const { paymentId } = body;

    const approveRes = await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
        },
      }
    );

    return approveRes.data;
  }
}
