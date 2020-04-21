import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublishingGateway } from './publishing.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PublishingGateway],
})
export class AppModule {}
