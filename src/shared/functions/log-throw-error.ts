import { Logger, HttpException } from '@nestjs/common';

export function logThrowError(error: any, context: string) {
   Logger.error(error.message || 'Error', null, context);
   throw new HttpException(error.message || 'Error', error.status || 500);
}
