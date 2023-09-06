import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { url as Url } from '@prisma/client';
import { UpdateUrlDto } from '../../dto/update-url.dto';
import { ERRORS } from '../../constants/errors';
import { LoggerService } from '../../services/logger.service';

@Injectable()
export class CrudService {
  constructor(
    private readonly logger: LoggerService,
    private readonly prisma: PrismaService,
  ) {}

  async getNewUrlId(url: string): Promise<number> {
    try {
      const urlObj = await this.prisma.url.create({
        data: {
          full_url: url,
        },
      });
      return urlObj.id;
    } catch {
      this.logger.error(
        ERRORS.DATABASE.WRITE,
        `Error in shirnkUrl() -> crudService.getNewUrlId() for url:${url}`,
      );
      throw new Error(ERRORS.DATABASE.WRITE);
    }
  }

  async updateNewUrl(data: UpdateUrlDto): Promise<Url> {
    try {
      return await this.prisma.url.update({
        where: {
          id: data.id,
        },
        data: {
          short_url: data.shortUrl,
        },
      });
    } catch {
      this.logger.error(
        ERRORS.DATABASE.UPDATE,
        `Error in shirnkUrl() -> crudService.updateNewUrl() for id:${data.id}, shortUrl:${data.shortUrl}`,
      );
      throw new Error(ERRORS.DATABASE.UPDATE);
    }
  }

  async getByUrl(urlType: string, url: string): Promise<Url> {
    // try {
    return await this.prisma.url.findUnique({
      where: { [urlType]: url },
    });
    // } catch {
    //   this.logger.error(
    //     ERRORS.DATABASE.UPDATE,
    //     `Error in crudService.getByUrl() for urlType:${urlType}, url:${urlType}`,
    //   );
    //   throw new Error(ERRORS.DATABASE.READ);
    // }
  }
}
