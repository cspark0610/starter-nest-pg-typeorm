import { Injectable, Logger } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { ReceiverDto } from './dto/receiver.dto';

const logger = new Logger();

@Injectable()
export class EmailsService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * SMTP provider service
   */
  async sendEmail(
    receivers: ReceiverDto[],
    context: {
      [name: string]: any;
    },
  ) {
    try {
      const to: string[] = receivers.map((item) => item.email);

      const mailOptions = {
        from: 'devsmartcore@outlook.com',
        to,
        subject: 'Smartcore new organization registry',
        cc: 'giuseppecv56@gmail.com',
        template: `${process.cwd()}/templates/welcome`,
        context,
      } as ISendMailOptions;
      const result: SMTPTransport.SentMessageInfo =
        await this.mailerService.sendMail(mailOptions);

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
