import {BadRequestException, ExecutionContext, createParamDecorator} from "@nestjs/common";

export const Skip = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const skip = parseInt(req.query?.skip);
    if (skip < 0)
      throw new BadRequestException('Скип не может быть меньше 0');
    return skip;
  }
);

export const Take = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const take = parseInt(req.query?.take);
    if (take <= 0)
      throw new BadRequestException('Количество взятых элементов не может быть меньше или равен 0');
    return take;
  }
);
