import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { CrudService } from './modules/crud/crud.service';
import { ShrinkerService } from './modules/shrinker/shrinker.service';
import { RedisService } from './modules/redis/redis.service';
import { ERRORS } from './constants/errors';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

describe('AppService', () => {
  let appService: AppService;
  let crudService: CrudService;
  let shrinkerService: ShrinkerService;
  let redisService: RedisService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: CrudService,
          useValue: {
            getByUrl: jest.fn(),
            getNewUrlId: jest.fn(),
            updateNewUrl: jest.fn(),
          },
        },
        {
          provide: ShrinkerService,
          useValue: {
            getShortUrl: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    crudService = module.get<CrudService>(CrudService);
    shrinkerService = module.get<ShrinkerService>(ShrinkerService);
    redisService = module.get<RedisService>(RedisService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('shrinkUrl', () => {
    it('should return existing short URL if it exists in the database', async () => {
      const url = 'http://example.com';
      const existingUrl = {
        id: 1,
        full_url: url,
        short_url: 'http://short.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(crudService, 'getByUrl').mockResolvedValue(existingUrl);

      const result = await appService.shirnkUrl(url);

      expect(result).toBe(existingUrl.short_url);
    });

    it('should generate a new short URL if it does not exist in the database', async () => {
      const url = 'http://example.com';
      const existingUrl = null;
      const id = 1;
      const token = 'xyz789';
      const prefix = 'http://vo';
      jest.spyOn(crudService, 'getByUrl').mockResolvedValue(existingUrl);
      jest.spyOn(crudService, 'getNewUrlId').mockResolvedValue(id);
      jest.spyOn(shrinkerService, 'getShortUrl').mockResolvedValue(token);
      jest.spyOn(appService, 'getPrefix').mockResolvedValue(prefix);

      const result = await appService.shirnkUrl(url);

      expect(result).toBe(`${prefix}/${token}`);
      expect(crudService.updateNewUrl).toHaveBeenCalledWith({
        id,
        shortUrl: `${prefix}/${token}`,
      });
      expect(redisService.set).toHaveBeenCalledWith(`${prefix}/${token}`, url);
    });
  });

  describe('getFullUrl', () => {
    it('should return full URL from Redis if it exists', async () => {
      const url = 'http://short.com';
      const fullUrl = 'http://full.com';
      jest.spyOn(redisService, 'get').mockResolvedValue(fullUrl);

      const result = await appService.getFullUrl(url);

      expect(result).toBe(fullUrl);
    });

    it('should return full URL from the database if it exists', async () => {
      const url = 'http://short.com';
      const fullUrl = 'http://full.com';
      const urlObj = {
        id: 1,
        full_url: fullUrl,
        short_url: url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(crudService, 'getByUrl').mockResolvedValue(urlObj);

      const result = await appService.getFullUrl(url);

      expect(result).toBe(fullUrl);
    });

    it('should throw a NotFoundException if URL does not exist', async () => {
      const url = 'http://nonexistent.com';
      const urlObj = null;
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(crudService, 'getByUrl').mockResolvedValue(urlObj);

      try {
        await appService.getFullUrl(url);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(ERRORS.DATABASE.NOT_EXIST);
      }
    });
  });

  describe('getPrefix', () => {
    it('should return prefix from a valid URL', async () => {
      const url = 'http://example.com';
      const prefix = 'http://';
      jest.spyOn(appService, 'getPrefix').mockResolvedValue(prefix);

      const result = await appService.getPrefix(url);

      expect(result).toBe(prefix);
    });

    it('should throw a BadRequestException for an invalid URL without protocol', async () => {
      const url = 'example.com'; // Invalid URL without protocol
      jest
        .spyOn(appService, 'getPrefix')
        .mockRejectedValue(
          new BadRequestException(ERRORS.URL_VALIDATION.INVALID_ENTRY),
        );

      try {
        await appService.getPrefix(url);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERRORS.URL_VALIDATION.INVALID_ENTRY);
      }
    });

    it('should throw a BadRequestException for a too short URL', async () => {
      const url = 'http://'; // Too short URL
      jest
        .spyOn(appService, 'getPrefix')
        .mockRejectedValue(
          new BadRequestException(ERRORS.URL_VALIDATION.TOO_SHORT),
        );

      try {
        await appService.getPrefix(url);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ERRORS.URL_VALIDATION.TOO_SHORT);
      }
    });
  });
});
