import { Controller, Get, Post, Body } from '@nestjs/common';
import { AmmService } from './amm.service';

@Controller('amm')
export class AmmController {
  constructor(private readonly ammService: AmmService) {}

  @Get('pools')
  getPools() {
    return this.ammService.getPools();
  }

  @Post('add-liquidity')
  addLiquidity(@Body() body: { tokenA: string; tokenB: string; amountA: number; amountB: number }) {
    return this.ammService.addLiquidity(body.tokenA, body.tokenB, body.amountA, body.amountB);
  }

  @Post('swap')
  swap(@Body() body: { tokenIn: string; tokenOut: string; amountIn: number }) {
    return this.ammService.swap(body.tokenIn, body.tokenOut, body.amountIn);
  }
}
