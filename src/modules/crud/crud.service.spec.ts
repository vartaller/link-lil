import { Test, TestingModule } from '@nestjs/testing';
import { CrudService } from './crud.service';
import { PrismaService } from '../../services/prisma.service';
import { LoggerService } from '../../services/logger.service';
import { UpdateUrlDto } from '../../dto/update-url.dto';
import { ERRORS } from '../../constants/errors';

describe('CrudService', () => {
  let crudService: CrudService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrudService, PrismaService, LoggerService],
    }).compile();

    crudService = module.get<CrudService>(CrudService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(crudService).toBeDefined();
  });

  describe('getNewUrlId', () => {
    it('should get new URL ID', async () => {
      const url = 'http://example.com';
      const mockUrlObj = {
        id: 1,
        full_url: url,
        short_url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.url, 'create').mockResolvedValue(mockUrlObj);

      const result = await crudService.getNewUrlId(url);

      expect(result).toEqual(mockUrlObj.id);
    });

    it('should throw error for invalid input', async () => {
      try {
        await crudService.getNewUrlId('invalid_url');
      } catch (error) {
        expect(error.message).toBe(ERRORS.DATABASE.WRITE);
      }
    });

    it('should return a number for valid input', async () => {
      const url = 'http://example.com';
      const mockUrlObj = {
        id: 1,
        full_url: url,
        short_url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.url, 'create').mockResolvedValue(mockUrlObj);

      const urlId = await crudService.getNewUrlId(url);
      expect(typeof urlId).toBe('number');
    });
  });

  describe('updateNewUrl', () => {
    it('should update new URL', async () => {
      const updateDto: UpdateUrlDto = {
        id: 1,
        shortUrl: 'http://short.com',
      };
      const mockUrlObj = {
        id: 1,
        full_url: 'http://long.com',
        short_url: updateDto.shortUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.url, 'update').mockResolvedValue(mockUrlObj);

      const result = await crudService.updateNewUrl(updateDto);

      expect(result).toEqual(mockUrlObj);
    });

    it('should throw error for invalid input', async () => {
      try {
        await crudService.updateNewUrl({
          id: null,
          shortUrl: 'invalid_short_url',
        });
      } catch (error) {
        expect(error.message).toBe(ERRORS.DATABASE.UPDATE);
      }
    });
  });

  describe('getByUrl', () => {
    it('should get URL by type and URL', async () => {
      const urlType = 'full_url';
      const url = 'http://example.com';
      const mockUrlObj = {
        id: 1,
        [urlType]: url,
        short_url: 'http://short.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.url, 'findUnique').mockResolvedValue(mockUrlObj);

      const result = await crudService.getByUrl(urlType, url);

      expect(result).toEqual(mockUrlObj);
    });

    it('should throw error for invalid input', async () => {
      try {
        await crudService.getByUrl('invalid_type', 'invalid_url');
      } catch (error) {
        expect(error.message).toBe(ERRORS.DATABASE.READ);
      }
    });
  });
});
