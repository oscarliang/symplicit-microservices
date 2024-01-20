import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';

export const getRequest = (context: ExecutionContext) => {
  let request = context.switchToHttp().getRequest();
  if (!request) {
    const ctx = GqlExecutionContext.create(context);
    // get the resolve request
    request = ctx.getContext().req;
  }
  return request;
};
