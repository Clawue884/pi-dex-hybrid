// backend-amm/src/router.mev.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class MEVRouter {
  constructor(
    private readonly amm: any,
    private readonly orderbook: any
  ) {}

  async route(pair: string, side: "buy" | "sell", amount: number, user: string, maxSlippage: number) {
    const ammQuote = await this.amm.quote(pair, side, amount);
    const obQuote = await this.orderbook.quote(pair, side, amount);

    const best = side === "buy"
      ? (ammQuote.price <= obQuote.price ? ammQuote : obQuote)
      : (ammQuote.price >= obQuote.price ? ammQuote : obQuote);

    if (Math.abs(best.slippage) > maxSlippage) {
      throw new Error("MEV GUARD: Slippage too high");
    }

    return best.source === "AMM"
      ? this.amm.executeSwap(pair, side, amount, user)
      : this.orderbook.placeOrder(pair, side, amount, user);
  }
}
