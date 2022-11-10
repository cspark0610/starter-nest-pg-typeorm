/* eslint-disable @typescript-eslint/no-misused-promises */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { type Transporter, createTransport, SendMailOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailConfig } from './config';

import { User } from '../users/entities/user.entity';

import { ReceiverDto } from './dto/receiver.dto';

const logger = new Logger();

@Injectable()
export class EmailsService {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(@Inject('CONFIG_OPTIONS') private options: EmailConfig) {
    this.transporter = createTransport({
      // host: process.env.MAIL_HOST,
      // port: process.env.MAIL_PORT,
      service: process.env.MAIL_SERVICE,
      // secure: process.env.MAIL_SECURE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      logger: true,
    });
  }

  /**
   * GMAIL provider service
   */
  async sendEmail(receivers: ReceiverDto[], data: User) {
    try {
      const to: string[] = receivers.map((item) => item.email);
      const mailOptions = {
        from: this.options.from,
        to,
        subject: 'Smartcore new organization registry',
        cc: this.options.cc,
        html: `<b>No Reply SmartCore </b><br> New organization data: ${JSON.stringify(
          data,
        )}<br />`,
        template: `${process.cwd()}/templates/welcome`,
      } as SendMailOptions;
      const result: SMTPTransport.SentMessageInfo = await this.transporter
        .sendMail(mailOptions)
        .then((info) => info);

      if (result.messageId)
        logger.debug(
          `Email sent successfully to ${to.join(', ')}`,
          'NodeMailer',
        );
    } catch (error) {
      logger.error(error);
    }
  }
}
