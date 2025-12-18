import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SummaryModule } from './modules/summary/summary.module';
import { FileStorageModule } from './common/file-storage/file-storage.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { PdfModule } from './common/pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.development`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        serverSelectionTimeoutMS: 60 * 1000,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get('REDIS_URI'),
        },
      }),
      inject: [ConfigService],
    }),
    SummaryModule,
    FileStorageModule,
    PdfModule,
  ],

  controllers: [],
  providers: [AppService],
})
export class AppModule {}
