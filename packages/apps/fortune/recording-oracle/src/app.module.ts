import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { HttpValidationPipe } from '@/common/pipes';
import { JobModule } from '@/modules/job/job.module';

import { AppController } from './app.controller';
import {
  envValidator,
  s3Config,
  serverConfig,
  web3Config,
} from './common/config';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV as string}`
        : '.env',
      validationSchema: envValidator,
      load: [serverConfig, s3Config, web3Config],
    }),
    JobModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
