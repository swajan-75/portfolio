import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service';
import { EmailDeliveryException } from '../common/exceptions/email.exceptions';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let sendMail: jest.Mock;

  beforeEach(async () => {
    sendMail = jest.fn();
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail });

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws EmailDeliveryException when the SMTP send fails', async () => {
    sendMail.mockRejectedValue(new Error('SMTP connection refused'));

    await expect(
      service.sendOtpEmail('admin@example.com', '123456'),
    ).rejects.toBeInstanceOf(EmailDeliveryException);
  });
});
