import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PricingGateway } from './pricing.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PricingGateway],
})
export class AppModule {}
