import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SecurityAdapter } from './common/adapters/security.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  SecurityAdapter(app, configService);

  const PORT = configService.getOrThrow<number>('PORT');

  await app.listen(PORT);

  console.info(`Server is running on PORT: ${PORT}`);
}

bootstrap();
