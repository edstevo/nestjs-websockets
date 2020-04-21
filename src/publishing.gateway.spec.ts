import { Test, TestingModule } from '@nestjs/testing';
import { PublishingGateway } from './publishing.gateway';

describe('PublishingGateway', () => {
  let gateway: PublishingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublishingGateway],
    }).compile();

    gateway = module.get<PublishingGateway>(PublishingGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
