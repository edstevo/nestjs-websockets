import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class AppService {

  constructor(private readonly websocketGateway: WebsocketGateway) {}

  public async doSomething(): Promise<void> {

    this.websocketGateway.publishEvent('testEvent', {testData: true});

    this.websocketGateway.publishEventInRoom('testRoom', 'testEvent', {testData: true});

  }
}