import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  CallHandler,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

const IgnoredPropertyName = Symbol('transform-interceptor');

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((context.getHandler() as any)[IgnoredPropertyName]) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => classToPlain(data)));
  }
}

export function TransformInterceptorIgnore() {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value[IgnoredPropertyName] = true;
  };
}
