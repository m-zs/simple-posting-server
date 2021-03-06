import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthUser } from '../types/auth-user.type';
import { AuthService } from '../services/auth.service';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Login' })
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
  @ApiOperation({ summary: 'Logout' })
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  async singOut(
    @GetUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.signOut(user);

    res.clearCookie('rtc');
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh auth session' })
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @GetUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.authService.refresh(user);

    res.cookie('rtc', refreshToken, { httpOnly: true });
    return { accessToken };
  }
}
