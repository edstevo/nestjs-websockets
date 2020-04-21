import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGateway } from './websocket.gateway';

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;
  let mockClient: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsocketGateway,
      ],
    }).compile();

    gateway = module.get<WebsocketGateway>(WebsocketGateway);

    mockClient = {
      on: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
    }
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe("handleConnection", () => {

    it('should listen for socket subscribe and unsubscribe events', async () => {
      await gateway.handleConnection(mockClient);
      expect(mockClient.on).toHaveBeenCalledTimes(2);
    });
  });

  describe("handleSubscribeEvent", () => {

    it('should fire socket join event correctly', async () => {
      const testRoom = 'testRoom';
      const callback = jest.fn();
      await gateway.handleSubscribeEvent(mockClient, testRoom, callback);

      expect(mockClient.join).toHaveBeenLastCalledWith('testRoom');
      expect(callback).toHaveBeenLastCalledWith(`subscribed: ${testRoom}`);
    });
  });

  describe("handleUnsubscribeEvent", () => {

    it('should fire socket join event correctly', async () => {
      const testRoom = 'testRoom';
      const callback = jest.fn();
      await gateway.handleUnsubscribeEvent(mockClient, testRoom, callback);

      expect(mockClient.leave).toHaveBeenLastCalledWith('testRoom');
      expect(callback).toHaveBeenLastCalledWith(`unsubscribed: ${testRoom}`);
    });
  });
});
