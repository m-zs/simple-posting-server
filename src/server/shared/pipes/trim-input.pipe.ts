import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimInputPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;

    if (type === 'body' && values && typeof values === 'object') {
      return Object.keys(values).reduce(
        (obj, key) => {
          const value = values[key];

          if (typeof value === 'string') {
            obj[key] = key !== 'password' ? value.trim() : value;
          }

          return obj;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as any,
      );
    }

    return values;
  }
}
