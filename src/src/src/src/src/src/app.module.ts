import { Module } from '@nestjs/common';
import { AmmController } from './amm.controller';
import { AmmService } from './amm.service';

@Module({
  controllers: [AmmController],
  providers: [AmmService],
})
export class AppModule {}
