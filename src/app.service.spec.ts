import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket.gateway';

jest.mock('./websocket.gateway');

describe('AppService', () => {
	let appService: AppService;
	let mockedWebsocketGateway: jest.Mocked<WebsocketGateway>;

  beforeEach(async () => {

		const MockedWebsocketGateway = WebsocketGateway as jest.Mock<WebsocketGateway>;
    mockedWebsocketGateway = new MockedWebsocketGateway() as jest.Mocked<WebsocketGateway>;

    const app: TestingModule = await Test.createTestingModule({
      providers: [
				AppService,
				{
					provide: WebsocketGateway,
					useValue: mockedWebsocketGateway
				}
			],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {

		it('should call publishing gateway correctly', () => {
			appService.doSomething();

			expect(mockedWebsocketGateway.publishEvent).toHaveBeenCalled();
			expect(mockedWebsocketGateway.publishEventInRoom).toHaveBeenCalled();
    });
  });
});
