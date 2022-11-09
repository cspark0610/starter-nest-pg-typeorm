/* eslint-disable arrow-body-style */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { configSchema, configurations } from './common/configuration';
import { SERVICES } from './modules/emails/config';

import { EmailsModule } from './modules/emails/emails.module';
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
    EmailsModule.register({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      from: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      service: process.env.MAIL_SERVICE as SERVICES,
      cc: process.env.MAIL_CC,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
