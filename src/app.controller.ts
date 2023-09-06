import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('shrink-url')
  async shrink(@Body('url') url: string): Promise<string> {
    return await this.appService.shirnkUrl(url);
  }

  @Get('full-url')
  async getLongUrl(@Body('url') url: string): Promise<string> {
    return await this.appService.getFullUrl(url);
  }
}
