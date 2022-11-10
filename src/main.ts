/* eslint-disable @typescript-eslint/no-floating-promises */
import { fastifyHelmet } from '@fastify/helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { initSwagger } from './app.swagger';
import { fastifyOpts } from './fastifyConfigOptions';
import { generateReport } from './scripts';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyOpts),
    {
      logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    },
  );

  /* ======= LOAD CONFIG .ENV.* ======= */
  const config: ConfigService<Record<string, unknown>> = app.get(ConfigService);

  /* ======= SET PREFIX END_POINT ======= */
  app.setGlobalPrefix('api/v1');

  /* ======= ENABLE FASTIFY HELMET ======= */
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [
          `'self'`,
          `'unsafe-inline'`,
          'cdn.jsdelivr.net',
          'fonts.googleapis.com',
        ],
        fontSrc: [`'self'`, 'fonts.gstatic.com'],
        imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`, `cdn.jsdelivr.net`],
      },
    },
  });

  /* ======= ENABLE CORS ======= */
  app.enableCors();

  /* ======= VALIDATE PIPE (USE DTOs) ======= */
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidNonWhitelisted: true }),
  );

  /* ======= INIT DOC SWAGGER ======= */
  if (process.env.NODE_ENV !== 'production') {
    initSwagger(app);
  }

  /* ======= SET PORT ======= */
  await app.listen(config.get<number>('api.port'), '0.0.0.0');

  /* ======= REPORT SCRIPTS ======= */
  generateReport({
    message: 'Connection Database Success',
    context: 'TypeORM',
  });

  /* ======= DOCS GENERATE ======= */
  if (process.env.NODE_ENV !== 'production') {
    logger.debug(
      `Swagger document generated ${await app.getUrl()}/api/docs`,
      'Swagger',
    );
  }
}

bootstrap();
