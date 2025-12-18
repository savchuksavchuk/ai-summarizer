import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

export const SecurityAdapter = (
  app: NestExpressApplication,
  configService: ConfigService,
): void => {
  app.enableCors({
    origin: [configService.getOrThrow('CORS_ORIGINS').split('\n')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.set('trust proxy', 'loopback');
};
