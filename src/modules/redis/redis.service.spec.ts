import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { LoggerService } from '../../services/logger.service';

describe('RedisService', () => {
  let service: RedisService;

  const redisClientMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        LoggerService,
        {
          provide: 'REDIS_CLIENT',
          useValue: redisClientMock,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set a key-value pair in Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    redisClientMock.set.mockResolvedValue('OK');

    await service.set(key, value);

    expect(redisClientMock.set).toHaveBeenCalledWith(key, value);
  });

  it('should handle errors when setting a key-value pair in Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    redisClientMock.set.mockRejectedValue(new Error('Failed to set'));

    try {
      await service.set(key, value);
    } catch (error) {
      expect(error.message).toBe('Failed to set');
    }
  });

  it('should get a value from Redis', async () => {
    const key = 'testKey';
    const expectedValue = 'testValue';
    redisClientMock.get.mockResolvedValue(expectedValue);

    const result = await service.get(key);

    expect(result).toBe(expectedValue);
    expect(redisClientMock.get).toHaveBeenCalledWith(key);
  });
});
