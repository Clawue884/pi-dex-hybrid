import { Module } from '@nestjs/common';
import { AmmController } from './amm.controller';
import { AmmService } from './amm.service';
import { HybridRouterService } from './hybrid-router.service';

@Module({
  controllers: [AmmController],
  providers: [AmmService, HybridRouterService],
})
export class AppModule {}
