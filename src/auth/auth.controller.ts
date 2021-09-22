import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthUser } from './auth-user.type';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.signIn(
      authCredentialsDto,
    );

    res.cookie('rtc', refreshToken, { httpOnly: true });

    return { accessToken };
  }

  @Post('signout')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  async singOut(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: AuthUser,
  ) {
    await this.authService.signOut(user);

    res.clearCookie('rtc');
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: AuthUser,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.refresh(user);

    res.cookie('rtc', refreshToken, { httpOnly: true });

    return { accessToken };
  }
}
