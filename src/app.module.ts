/* eslint-disable arrow-body-style */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { configSchema, configurations } from './common/configuration';

import { OrganizationModule } from './modules/organization/organization.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: configSchema,
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<Partial<TypeOrmModuleOptions>>('database');
      },
    }),
    UsersModule,
    OrganizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
