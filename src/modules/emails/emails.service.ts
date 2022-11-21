/* eslint-disable consistent-return */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { IEmailResponse } from './interfaces';

import { ReceiverDto } from './dto/receiver.dto';

@Injectable()
export class EmailsService {
  default_receiver = 'devsmartcore@outlook.com';

  constructor(private readonly mailerService: MailerService) {}

  /**
   * SMTP provider service
   */
  async sendEmail(
    receivers: ReceiverDto[],
    context: {
      [name: string]: any;
    },
    template: string,
  ): Promise<IEmailResponse> {
    try {
      const to: string[] = receivers.map((item) => item.email);

      const mailOptions = {
        to,
        subject: 'Smartcore new organization registry',
        template: `${process.cwd()}/templates/${template}`,
        context,
      } as ISendMailOptions;
      const result: SMTPTransport.SentMessageInfo =
        await this.mailerService.sendMail(mailOptions);

      if (result.messageId)
        return {
          success: true,
          message: `Email sent successfully to ${to.join(', ')}`,
        };
    } catch (error) {
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  }
}
