import { ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException)
      response.json(exception.getResponse());
    else 
      response
        .status(400)
        .json({
        ...exception
      });
  }
}
