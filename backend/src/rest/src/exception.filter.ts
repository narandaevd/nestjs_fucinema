import { ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../../exceptions';
import { HttpCodes } from './consts';

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {

  public constructor(
    private readonly mapperExceptionNameToHttpCode: Record<string, number>,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    if (isHttpException) {
      const excToReturn = HttpException.createBody(
        exception,
        undefined,
        exception.getStatus(),
      );
      response
        .status(exception.getStatus())
        .json(excToReturn);
      return;
    }

    const isBusinessException = exception instanceof BaseException;
    if (isBusinessException) {
      const statusCode = this.mapperExceptionNameToHttpCode[exception.code];
      const httpException = HttpException.createBody(
        exception, 
        undefined, 
        statusCode,
      );
      response
        .status(statusCode)
        .json({
          ...httpException,
          statusCode: statusCode,
        });
      return;
    }
      
    response
      .status(HttpCodes.INTERNAL_SERVER_ERROR)
      .json({
        ...exception
      });
  }
}
