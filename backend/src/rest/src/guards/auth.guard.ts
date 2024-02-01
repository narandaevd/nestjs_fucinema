import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import {AuthJwtService} from '../services/auth-jwt.service';
import { UnauthorizedException } from "../../../exceptions";
import { Request } from "express";
import {TokenExpiredError} from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly authJwtService: AuthJwtService,
  ) {}
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.authJwtService.extractToken(request.headers.authorization);
    if (!token)
      throw new UnauthorizedException('Пользователь не авторизован');
    try {
      const payload = this.authJwtService.verify(token);
      (request as any)['user'] = payload;
    } catch (err) {
      console.dir(err);
      const msg = err instanceof TokenExpiredError ? 
        'Пользователь не авторизован' : 
        'Введён неверный пароль или логин';
      throw new UnauthorizedException(msg);
    }
    return true;
  }
}
