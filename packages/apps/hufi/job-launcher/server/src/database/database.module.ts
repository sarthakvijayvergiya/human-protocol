import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthEntity } from '../modules/auth/auth.entity';
import { NS } from '../common/constants';
import { TokenEntity } from '../modules/auth/token.entity';
import { UserEntity } from '../modules/user/user.entity';

import { TypeOrmLoggerModule, TypeOrmLoggerService } from './typeorm';
import { JobEntity } from '../modules/job/job.entity';
import { PaymentEntity } from '../modules/payment/payment.entity';
import { ConfigNames } from '../common/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmLoggerModule, ConfigModule],
      inject: [TypeOrmLoggerService, ConfigService],
      useFactory: (
        typeOrmLoggerService: TypeOrmLoggerService,
        configService: ConfigService,
      ) => {
        typeOrmLoggerService.setOptions('all');
        return {
          name: 'default',
          type: 'postgres',
          entities: [
            AuthEntity,
            TokenEntity,
            UserEntity,
            JobEntity,
            PaymentEntity,
          ],
          // We are using migrations, synchronize should be set to false.
          synchronize: false,
          // Run migrations automatically,
          // you can disable this if you prefer running migration manually.
          migrationsTableName: NS,
          migrationsTransactionMode: 'each',
          namingStrategy: new SnakeNamingStrategy(),
          logging:
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'staging',
          // Allow both start:prod and start:dev to use migrations
          // __dirname is either dist or server folder, meaning either
          // the compiled js in prod or the ts in dev.
          migrations: [path.join(__dirname, '/migrations/**/*{.ts,.js}')],
          //"migrations": ["dist/migrations/*{.ts,.js}"],
          logger: typeOrmLoggerService,
          host: configService.get<string>(
            ConfigNames.POSTGRES_HOST,
            'localhost',
          ),
          port: configService.get<number>(ConfigNames.POSTGRES_PORT, 5432),
          username: configService.get<string>(
            ConfigNames.POSTGRES_USER,
            'operator',
          ),
          password: configService.get<string>(
            ConfigNames.POSTGRES_PASSWORD,
            'qwerty',
          ),
          database: configService.get<string>(
            ConfigNames.POSTGRES_DATABASE,
            'job-launcher',
          ),
          keepConnectionAlive:
            configService.get<string>(ConfigNames.NODE_ENV) === 'test',
          migrationsRun: false,
          ssl:
            configService
              .get<string>(ConfigNames.POSTGRES_SSL)
              ?.toLowerCase() === 'true',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
