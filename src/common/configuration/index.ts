import type { JwtModuleOptions } from '@nestjs/jwt';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

import Joi from 'joi';
import { join } from 'path';

import { toBoolean } from '../helpers';

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string(),
  MAIL_HOST: Joi.string().required(), // host
  MAIL_PORT: Joi.string().required(), // host
  MAIL_SECURE: Joi.string().required(), // host
  MAIL_USER: Joi.string().required(), // host
  MAIL_PASS: Joi.string().required(), // host
  DEFAULT_USER_EMAIL: Joi.string().email(),
  DEFAULT_USER_PASSWORD: Joi.string().min(8).max(256),
});

export const configurations = () => ({
  api: {
    port: parseInt(process.env.PORT, 10) || 4000,
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
      join(__dirname, '../../**/*entity{.ts,.js}'),
      join(__dirname, '../../**/**/*entity{.ts,.js}'),
    ],
    autoLoadEntities: true,

    // Migrations
    migrationsRun: true,
    migrationsTableName: 'migration_table',
    migrations: [join(__dirname, '../../migrations/**/*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/migrations',
    },

    // TypeORM
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    logger: 'file',
  } as TypeOrmModuleOptions,
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  } as JwtModuleOptions,
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10) || 25,
    secure: toBoolean(process.env.MAIL_SECURE),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  // TODO: modificarlo de acuerdo a la nueva tabla
  // defaultUser: {
  //   name: 'admin',
  //   lastName: 'admin',
  //   phone: 'admin',
  //   username: 'admin',
  //   email: process.env.DEFAULT_USER_EMAIL || 'admin@smartcore.pe',
  //   password: process.env.DEFAULT_USER_PASSWORD || 'password#123@',
  //   state: 'active',
  //   photo: 'admin',
  //   address: 'admin',
  //   language: 'ES(Español)',
  //   mode: false,
  //   roleId: 1,
  // },
  url: {
    base: process.env.BASE_URL || 'http://localhost:4000',
  },
  basic: {
    username: process.env.BASIC_USERNAME,
    password: process.env.BASIC_PASSWORD,
  },
});
