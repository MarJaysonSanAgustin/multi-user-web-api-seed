import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export function successReturn(
   res: Response,
   data: any,
   status: HttpStatus = HttpStatus.OK,
   message: string = 'Success'
) {
   return res.status(status).json({ statusCode: status || 200, success: true, message, data }).end();
}
