import {Body, Controller, Post} from "@nestjs/common";
import {API_V1} from "../consts";
import { AuthService } from '../../../service-layer';
import {AuthResult} from "../../../domain";
import {RegisterRestDto} from "../dtos";

@Controller(`${API_V1}/users`)
export class UserController {
  public constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() restDto: RegisterRestDto): Promise<AuthResult> {
    return await this
      .authService
      .register(
        restDto.login,
        restDto.password
      );
  }
}
