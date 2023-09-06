import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.SERVER_PORT, () =>
    console.log(`App started on port: ${process.env.SERVER_PORT}`),
  );
}
bootstrap();
