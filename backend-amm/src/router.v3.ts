// backend-amm/src/router.v3.ts
import { Injectable } from "@nestjs/common";

interface Quote {
  price: number;
  liquidity: number;
  source: "AMM" | "CLOB";
}

@Injectable()
export class RouterV3 {
  constructor(
    private readonly ammService: any,
    private readonly orderbookService: any,
  ) {}

  async getBestQuote(pair: string, side: "buy" | "sell", amount: number): Promise<Quote> {
    const ammQuote = await this.ammService.quote(pair, side, amount);
    const obQuote = await this.orderbookService.quote(pair, side, amount);

    // Smart decision: best price + enough liquidity
    if (side === "buy") {
      return ammQuote.price <= obQuote.price ? ammQuote : obQuote;
    } else {
      return ammQuote.price >= obQuote.price ? ammQuote : obQuote;
    }
  }

  async routeTrade(pair: string, side: "buy" | "sell", amount: number, user: string) {
    const best = await this.getBestQuote(pair, side, amount);

    if (best.source === "AMM") {
      return this.ammService.executeSwap(pair, side, amount, user);
    } else {
      return this.orderbookService.placeOrder(pair, side, amount, user);
    }
  }
}
