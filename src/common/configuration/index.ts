import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type SMTPConnection from 'nodemailer/lib/smtp-connection';

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
  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.string().required(),
  MAIL_SECURE: Joi.string().required(),
  MAIL_USER: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_LOGGER: Joi.string().default(false),
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
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 25,
    // upgrade later with STARTTLS
    secure: toBoolean(process.env.MAIL_SECURE) || false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    logger: toBoolean(process.env.MAIL_LOGGER) || false,
  } as SMTPConnection.Options,
});
