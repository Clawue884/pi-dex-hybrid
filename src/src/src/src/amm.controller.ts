import { Controller, Get, Post, Body } from '@nestjs/common';
import { AmmService } from './amm.service';

@Controller('amm')
export class AmmController {
  constructor(private readonly ammService: AmmService) {}

  @Get('pool')
  getPool() {
    return this.ammService.getPool();
  }

  @Post('add-liquidity')
  addLiquidity(@Body() body: { amountA: number; amountB: number }) {
    return this.ammService.addLiquidity(body.amountA, body.amountB);
  }

  @Post('swap')
  swap(@Body() body: { amountA: number }) {
    return this.ammService.swapAforB(body.amountA);
  }
}
