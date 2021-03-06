import { Controller, Get, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';

import { ViewService } from '../services/view.service';

@Controller('/')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get('*')
  static(@Req() req: Request, @Res() res: Response) {
    const handle = this.viewService.getNextServer().getRequestHandler();

    handle(req, res);
  }
}
