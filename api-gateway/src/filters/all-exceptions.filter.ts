import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ContextType,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): Error | void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    console.log(exception);

    const { httpAdapter } = this.httpAdapterHost;
    let ctx;
    let path;
    let response;
    let httpStatus;
    switch (host.getType<ContextType | 'graphql'>()) {
      case 'http':
        httpStatus =
          exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        ctx = host.switchToHttp();
        path = httpAdapter.getRequestUrl(ctx.getRequest());
        response = ctx.getResponse();
        httpAdapter.reply(
          response,
          {
            message: exception.message,
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: path,
          },
          httpStatus,
        );
        break;
      case 'rpc':
        httpStatus = HttpStatus.NOT_IMPLEMENTED;
        break;
      case 'graphql':
        ctx = GqlArgumentsHost.create(host).getArgByIndex(2);
        path = httpAdapter.getRequestUrl(ctx.req);
        if (exception instanceof HttpException) {
          httpStatus = exception.getStatus().toString();
          return new ApolloError(exception.message, httpStatus, {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: path,
          });
        }
        return exception;
      default:
        httpStatus = HttpStatus.NOT_IMPLEMENTED;
    }
  }
}
