import { Test, TestingModule } from '@nestjs/testing';
import { ShrinkerService } from './shrinker.service';

describe('ShrinkerService', () => {
  let service: ShrinkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShrinkerService],
    }).compile();

    service = module.get<ShrinkerService>(ShrinkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a short URL', async () => {
    const id = 1;

    const result = await service.getShortUrl(id);
    expect(result).toBeDefined();
  });
});
