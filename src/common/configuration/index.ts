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
  MAIL_HOST: Joi.string(), // host
  MAIL_PORT: Joi.string(), // host
  MAIL_SECURE: Joi.string().required(), // host
  MAIL_USER: Joi.string().required(), // host
  MAIL_PASSWORD: Joi.string().required(), // host
  MAIL_SERVICE: Joi.string().required(), // host
  MAIL_CC: Joi.string(), // host
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

  // EmailsModule
  mail: {
    host: process.env.MAIL_HOST || '',
    port: parseInt(process.env.MAIL_PORT, 10) || 25,
    secure: toBoolean(process.env.MAIL_SECURE),
    cc: process.env.MAIL_CC,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  url: {
    base: process.env.BASE_URL || 'http://localhost:4000',
  },
  basic: {
    username: process.env.BASIC_USERNAME,
    password: process.env.BASIC_PASSWORD,
  },
});
