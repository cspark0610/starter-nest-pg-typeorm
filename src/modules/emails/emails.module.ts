import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import SMTPConnection from 'nodemailer/lib/smtp-connection';
import { join } from 'path';

import { EmailConfig } from './config';

import { EmailsService } from './emails.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: config.get<SMTPConnection.Options>('mail'),
        defaults: {
          from: '"smartcore" <devsmartcore@outlook.com>',
        },
        template: {
          dir: join(__dirname, '../../../templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: join(__dirname, '../../../templates/partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
    }),
  ],
  providers: [EmailsService],
})
export class EmailsModule {
  static register(options: EmailConfig): DynamicModule {
    return {
      module: EmailsModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        EmailsService,
      ],
      exports: [EmailsService],
    };
  }
}
