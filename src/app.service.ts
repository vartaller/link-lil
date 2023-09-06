import { Injectable } from '@nestjs/common';
import { CrudService } from './modules/crud/crud.service';
import { ShrinkerService } from './modules/shrinker/shrinker.service';
import { RedisService } from './modules/redis/redis.service';
import { ERRORS } from './constants/errors';
import { URL_TYPE } from './constants/urlType';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoggerService } from './services/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly logger: LoggerService,
    private readonly crudService: CrudService,
    private readonly redisService: RedisService,
    private readonly shrinkerService: ShrinkerService,
  ) {}

  async shirnkUrl(url: string): Promise<string> {
    const prefix = await this.getPrefix(url);

    const existingUrl = await this.crudService.getByUrl(URL_TYPE.FULL, url);
    if (!!existingUrl) return existingUrl.short_url;

    const id = await this.crudService.getNewUrlId(url);
    const token = await this.shrinkerService.getShortUrl(id);
    const shortUrl = `${prefix}/${token}`;

    await this.crudService.updateNewUrl({
      id: id,
      shortUrl: shortUrl,
    });

    await this.redisService.set(shortUrl, url);

    return shortUrl;
  }

  async getFullUrl(url: string): Promise<string> {
    const fullUrl = await this.redisService.get(url);
    if (!!fullUrl) return fullUrl;
    const urlObj = await this.crudService.getByUrl(URL_TYPE.SHORT, url);
    if (!!urlObj) {
      return urlObj.full_url;
    } else {
      this.logger.error(ERRORS.DATABASE.NOT_EXIST, 'Error in getFullUrl()');
      throw new NotFoundException(ERRORS.DATABASE.NOT_EXIST);
    }
  }

  async getPrefix(url: string): Promise<string> {
    const matches = url.match(/^(https?:\/\/)?(.{2})/i);
    if (!matches[1]) {
      this.logger.warn(ERRORS.URL_VALIDATION.INVALID_ENTRY);
      throw new BadRequestException(ERRORS.URL_VALIDATION.INVALID_ENTRY);
    }

    if (matches.length >= 3) {
      return `${matches[1]}${matches[2]}`;
    } else {
      this.logger.error(
        ERRORS.URL_VALIDATION.TOO_SHORT,
        'Error in getPrefix()',
      );
      throw new BadRequestException(ERRORS.URL_VALIDATION.TOO_SHORT);
    }
  }
}
