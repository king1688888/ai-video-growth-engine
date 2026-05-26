import { Controller, Post, Get, Body, HttpCode } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() body: { email: string; password: string; displayName?: string }) {
    // TODO: Implement registration with password hash + org creation + credit grant
    return { success: true, data: { message: 'register placeholder' } };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    // TODO: Implement JWT login
    return { success: true, data: { accessToken: 'placeholder', refreshToken: 'placeholder' } };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { refreshToken: string }) {
    return { success: true, data: { accessToken: 'placeholder' } };
  }

  @Post('logout')
  @HttpCode(200)
  async logout() {
    return { success: true, data: { message: 'logged out' } };
  }

  @Get('me')
  async me() {
    // TODO: Extract from JWT
    return { success: true, data: { id: 'placeholder', email: 'placeholder' } };
  }
}
