/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailConfig } from './config';

import { User } from '../users/entities/user.entity';

import { ReceiverDto } from './dto/receiver.dto';

@Injectable()
export class EmailsService {
  transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(@Inject('CONFIG_OPTIONS') private options: EmailConfig) {
    this.transporter = nodemailer.createTransport({
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
      };
      const result: SMTPTransport.SentMessageInfo =
        await this.transporter.sendMail(mailOptions);

      if (result.messageId)
        console.log(`email sent successfully to ${to.join(', ')}`);
    } catch (error) {
      console.error(error);
    }
  }
}
