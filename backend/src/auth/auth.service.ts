import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import {
  UnauthorizedEmailException,
  InvalidOtpRequestException,
  OtpExpiredException,
  InvalidOtpException,
  GoogleNoUserException,
} from '../common/exceptions/auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (admin && admin.password) {
      const isMatch = await bcrypt.compare(pass, admin.password);
      if (isMatch) {
        const { password, ...result } = admin;
        return result;
      }
    }
    return null;
  }

  async sendOtp(email: string) {
    if (email !== process.env.SMTP_USER) {
      throw new UnauthorizedEmailException();
    }
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Save to DB (hashed)
    const hashedOtp = await bcrypt.hash(otp, 10);
    await this.prisma.admin.update({
      where: { email },
      data: { otp: hashedOtp, otpExpiry },
    });
    
    // Send email

    await this.emailService.sendOtpEmail(email, otp);

    return { message: 'OTP sent successfully to email' };
  }

  async verifyOtp(email: string, otp: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.otp || !admin.otpExpiry) {
      throw new InvalidOtpRequestException();
    }

    if (admin.otpExpiry < new Date()) {
      throw new OtpExpiredException();
    }

    const isMatch = await bcrypt.compare(otp, admin.otp);
    if (!isMatch) {
      throw new InvalidOtpException();
    }

    // Clear OTP
    await this.prisma.admin.update({
      where: { email },
      data: { otp: null, otpExpiry: null },
    });
    

    return this.generateJwtToken(admin);
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin || !admin.otp || !admin.otpExpiry) {
      throw new InvalidOtpRequestException('Invalid reset request');
    }

    if (admin.otpExpiry < new Date()) {
      throw new OtpExpiredException();
    }

    const isMatch = await bcrypt.compare(otp, admin.otp);
    if (!isMatch) {
      throw new InvalidOtpException();
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.admin.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new GoogleNoUserException();
    }

    const { email } = req.user;

    // Only allow specific email
    if (
      email !== process.env.SMTP_USER &&
      email !== 'swajanbarua09@gmail.com'
    ) {
      throw new UnauthorizedEmailException();
    }

    let admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      // Create admin if not exists (first time google login)
      admin = await this.prisma.admin.create({
        data: { email, googleId: req.user.googleId },
      });
    } else if (!admin.googleId && req.user.googleId) {
      admin = await this.prisma.admin.update({
        where: { email },
        data: { googleId: req.user.googleId },
      });
    }

    return this.generateJwtToken(admin);
  }

  private generateJwtToken(admin: any) {
    const payload = { email: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
