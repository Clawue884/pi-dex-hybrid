// backend-amm/src/ai/ai-market-maker.ts
import { Injectable } from "@nestjs/common";

interface MarketState {
  mid: number;
  vol: number;      // EWMA volatility
  inventory: number;
  k: number;        // risk aversion
}

@Injectable()
export class AIMarketMaker {
  private state: Record<string, MarketState> = {};

  init(pair: string, mid = 1, vol = 0.01, inventory = 0, k = 0.5) {
    this.state[pair] = { mid, vol, inventory, k };
  }

  // Update volatility with EWMA
  update(pair: string, lastPrice: number, alpha = 0.2) {
    const s = this.state[pair];
    const ret = Math.log(lastPrice / s.mid);
    s.vol = Math.sqrt(alpha * ret * ret + (1 - alpha) * s.vol * s.vol);
    s.mid = lastPrice;
  }

  // Avellaneda–Stoikov style quoting
  quote(pair: string, size: number) {
    const s = this.state[pair];
    const spread = s.k * s.vol * s.mid;
    const invAdj = s.inventory * 0.0001 * s.mid;

    const bid = s.mid - spread - invAdj;
    const ask = s.mid + spread - invAdj;

    return { bid, ask, mid: s.mid, vol: s.vol };
  }

  onFill(pair: string, side: "buy" | "sell", size: number) {
    const s = this.state[pair];
    s.inventory += side === "buy" ? size : -size;
  }
}
