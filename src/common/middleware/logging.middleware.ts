import { Injectable, NestMiddleware } from '@nestjs/common';
import { SimpleConsoleLogger } from 'typeorm';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');
    console.log('Hello!');

    res.on('finish', () => console.timeEnd('Request-response time'));
    next();
  }
}
