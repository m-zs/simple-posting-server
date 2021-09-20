import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { DB_ERRORS, formatDuplicateMessage } from 'src/shared/errors';

@Injectable()
export class ConflictInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error?.code === DB_ERRORS.DUPLICATE) {
          throw new ConflictException(
            error?.detail && formatDuplicateMessage(error.detail),
          );
        }

        throw error;
      }),
    );
  }
}
