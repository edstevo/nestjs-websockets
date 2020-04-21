import { Test, TestingModule } from '@nestjs/testing';
import { WebsocketGateway } from './websocket.gateway';
import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';

describe('WebsocketGateway', () => {
	let app: INestApplication;
	let port: number;
	let gateway: WebsocketGateway;
	let client: io.Socket;
	let wsNamespace: io.Namespace;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
				WebsocketGateway,
			],
    }).compile();

		app = module.createNestApplication();
		port = 5208;
		await app.listen(port);

		gateway = module.get<WebsocketGateway>(WebsocketGateway);
		wsNamespace = gateway.server.of('/');
	});

	beforeEach(async () => {
		client = await io(`http://localhost:${port}`, { autoConnect: false });
	});

	afterEach(async () => {
		await client.close();
	});

	afterAll(async () => {
		await app.close();
	});

  it('should be defined', () => {
    expect(gateway).toBeDefined();
	});

	describe('Client Connect', () => {

		it('should allow connections ok', (done) => {

			client.on('connect', () => {
				done();
			});

			client.connect();
		});
	});

  describe("handleSubscriptions", () => {
    let testChannel: string;
    let testEvent: string;
    let testData: string;

    beforeEach(async () => {
      testChannel = 'testChannel';
      testEvent = 'testEvent';
			testData = 'testData';

			await client.connect();
    });

    it('socket subscribe ok', (done) => {

      client.emit('subscribe', testChannel, (answer) => {
        expect(answer).toBe("subscribed: " + testChannel);

        expect(wsNamespace.adapter.rooms).toHaveProperty(testChannel);
        expect(wsNamespace.adapter.rooms[testChannel].sockets).toHaveProperty(client.id);
        done();
      });
    });

    it('socket should receive private events ok', (done) => {

      client.on(testEvent, (data) => {
        expect(data).toBe(testData);
        done();
      });

      client.emit('subscribe', testChannel, () => {
        wsNamespace.to(testChannel).emit(testEvent, testData);
      });
    });
  });

	describe("publishEvent", () => {

		it('should receive event ok', (done) => {
			const testData = 'testData';
			const event = 'TestEvent';

			client.on("TestEvent", (data) => {
				expect(data).toBe(testData);
				done();
			});

			client.on('connect', () => {
				gateway.publishEvent(event, testData);
			});

			client.connect();
		});
	});
});
