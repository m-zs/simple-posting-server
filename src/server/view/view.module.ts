import { Module } from '@nestjs/common';

import { ViewController } from './controllers/view.controller';
import { ViewService } from './services/view.service';

@Module({
  imports: [],
  providers: [ViewService],
  controllers: [ViewController],
})
export class ViewModule {}
