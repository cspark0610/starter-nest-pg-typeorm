import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as fs from 'fs';

export const initSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tenant API')
    .addBearerAuth()
    .setDescription('Service for managing tenants')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api/v1/docs', app, document, {
    swaggerOptions: {
      deepLinking: true,
      displayOperationId: true,
      defaultModelRendering: 'model',
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        activate: true,
        theme: 'arta',
      },
      tryItOutEnabled: false,
    },
  } as SwaggerCustomOptions);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
};
