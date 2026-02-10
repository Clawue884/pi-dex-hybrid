import { Injectable } from '@nestjs/common';
import { AmmService } from './amm.service';
import axios from 'axios';

@Injectable()
export class HybridRouterService {
  constructor(private readonly amm: AmmService) {}

  async route(tokenIn: string, tokenOut: string, amountIn: number) {
    const ammQuote = this.amm.quote(tokenIn, tokenOut, amountIn);

    const obQuote = await axios.post('http://localhost:8000/quote', {
      tokenIn,
      tokenOut,
      amountIn,
    });

    if (obQuote.data.amountOut > ammQuote.amountOut) {
      return { route: 'orderbook', ...obQuote.data };
    }

    return { route: 'amm', ...ammQuote };
  }
}
