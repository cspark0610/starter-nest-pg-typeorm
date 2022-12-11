/* eslint-disable consistent-return */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { AdminPayload, ClientPayload } from '../users/payloads';
import { EmailTemplate, To } from './enum';
import { IEmailResponse } from './interfaces';

@Injectable()
export class EmailsService {
  default_receiver = 'devsmartcore@outlook.com';

  constructor(private readonly mailerService: MailerService) {}

  /**
   * SMTP provider service
   */
  async sendEmail(
    to: string[],
    context: {
      [name: string]: any;
    },
    template: string,
  ): Promise<IEmailResponse> {
    try {
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

  @OnEvent(To.ADMIN)
  async handleEmailToAdmin(payload: AdminPayload) {
    const toAdmin = [this.default_receiver];
    return this.sendEmail(toAdmin, payload, EmailTemplate.REGISTER);
  }

  @OnEvent(To.CLIENT)
  async handleEmailToClient(payload: ClientPayload) {
    const toClient = [payload.email];
    return this.sendEmail(toClient, payload, EmailTemplate.WELCOME);
  }
}
