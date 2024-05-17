// Nest dependencies
import { Injectable } from '@nestjs/common';

// Other dependencies
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';

// Local files
import { MailSenderBody } from '../Types/mail';
import { configService } from './config.service';

@Injectable()
export class MailService {
  public sendVerificationMail(bodyData: MailSenderBody): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: configService.getEnv('SMTP_HOST'),
        port: configService.getEnv('SMTP_PORT'),
        secure: true,
        auth: {
          user: configService.getEnv('SMTP_MAIL'),
          pass: configService.getEnv('SMTP_PASSWORD'),
        },
      });

      await ejs.renderFile(
        `public/MailTemplates/verification.ejs`,
        {
          verificationAddress: bodyData.text,
          fullName: bodyData.recieverUsername,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiverEmail,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) reject(error);
              resolve();
            });
          }
        },
      );
    });
  }

  public sendRecoveryMail(bodyData: MailSenderBody): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport({
        host: configService.getEnv('SMTP_HOST'),
        port: configService.getEnv('SMTP_PORT'),
        secure: true,
        auth: {
          user: configService.getEnv('SMTP_MAIL'),
          pass: configService.getEnv('SMTP_PASSWORD'),
        },
      });

      await ejs.renderFile(
        `${__dirname}/../../../public/MailTemplates/recovery.ejs`,
        {
          generatedKey: bodyData.text,
          fullName: bodyData.recieverUsername,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiverEmail,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) reject(error);
              resolve();
            });
          }
        },
      );
    });
  }

  public sendEmailUpdate(bodyData: MailSenderBody): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport({
        host: configService.getEnv('SMTP_HOST'),
        port: configService.getEnv('SMTP_PORT'),
        secure: true,
        auth: {
          user: configService.getEnv('SMTP_MAIL'),
          pass: configService.getEnv('SMTP_PASSWORD'),
        },
      });

      await ejs.renderFile(
        `${__dirname}/../../../public/MailTemplates/mail-update.ejs`,
        {
          emailUpdateAddress: bodyData.text,
          fullName: bodyData.recieverUsername,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiverEmail,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) reject(error);
              resolve();
            });
          }
        },
      );
    });
  }

  public sendAccountActivation(bodyData: MailSenderBody): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const transporter = await nodemailer.createTransport({
        host: configService.getEnv('SMTP_HOST'),
        port: configService.getEnv('SMTP_PORT'),
        secure: true,
        auth: {
          user: configService.getEnv('SMTP_MAIL'),
          pass: configService.getEnv('SMTP_PASSWORD'),
        },
      });

      await ejs.renderFile(
        `${__dirname}/../../../public/MailTemplates/account-activation.ejs`,
        {
          accountActivationAddress: bodyData.text,
          fullName: bodyData.recieverUsername,
        },
        async (err: any, data: any) => {
          if (err) reject(err);
          else {
            const mailOptions: object = {
              from: configService.getEnv('SMTP_MAIL'),
              to: bodyData.receiverEmail,
              subject: bodyData.subject,
              html: data,
            };
            await transporter.sendMail(mailOptions, (error) => {
              if (error) reject(error);
              resolve();
            });
          }
        },
      );
    });
  }
}
