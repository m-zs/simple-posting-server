import {
  Catch,
  ArgumentsHost,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const { url, method } = host.getArgByIndex(0);

    if (exception instanceof InternalServerErrorException) {
      Logger.error(`Error occured on: [${method}]: ${url}`, exception);
    }

    super.catch(exception, host);
  }
}
