import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import ms from 'ms';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const ACCESS_TOKEN_COOKIE = 'access_token';

// No class-level @Controller() prefix: routes below intentionally mix the
// frontend's expected top-level paths (`login`, `otp/verify`, `admin/*`)
// with the pre-existing `auth/*` legacy paths (unused by the frontend but
// kept for Swagger/manual testing) — each handler declares its full path.
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password to receive OTP' })
  @ApiBody({ type: LoginDto })
  async login(@Req() req) {
    // LocalAuthGuard verifies email & password, req.user contains the user
    return this.authService.sendOtp(req.user.email);
  }

  @Post('otp/verify')
  @ApiOperation({ summary: 'Verify OTP and receive a JWT via httpOnly cookie' })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(
    @Body() { email, otp }: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.verifyOtp(email, otp);
    res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: ms((process.env.JWT_EXPIRES_IN || '1d') as ms.StringValue),
      path: '/',
    });
    return { message: 'Logged in' };
  }

  @Get('admin/checkAuth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check whether the access_token cookie is valid' })
  checkAuth() {
    return { authenticated: true };
  }

  @Post('admin/logout')
  @ApiOperation({ summary: 'Clear the access_token cookie' })
  logout(@Res({ passthrough: true }) res: Response) {
    // Deliberately unguarded: clearing a cookie must work even when the
    // cookie is already missing/expired.
    res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' });
    return { message: 'Logged out' };
  }

  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Request OTP for password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.sendOtp(email);
  }

  @Post('auth/reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() { email, otp, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(email, otp, newPassword);
  }

  @Get('auth/google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
  async googleAuth(@Req() req) {
    // Guard redirects to Google
  }

  @Get('auth/google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Google OAuth2 callback' })
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.googleLogin(req);
    res.cookie(ACCESS_TOKEN_COOKIE, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: ms((process.env.JWT_EXPIRES_IN || '1d') as ms.StringValue),
      path: '/',
    });
    return { message: 'Logged in' };
  }
}
