import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailDeliveryException } from '../common/exceptions/email.exceptions';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: 'Your Admin Login OTP',
      text: `Your OTP for login/password reset is: ${otp}\nThis OTP is valid for 10 minutes.`,
      html: `<p>Your OTP for login/password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error('Error sending OTP email', error);
      throw new EmailDeliveryException();
    }
  }
}
