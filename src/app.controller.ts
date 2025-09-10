import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get()
  getHello(): object {
    return {
      message: 'Fortrez API is running!',
      version: '1.0.0',
      docs: '/api',
    };
  }
}
