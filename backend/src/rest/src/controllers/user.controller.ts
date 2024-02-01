import {Body, Controller, Post, Version, HttpCode} from "@nestjs/common";
import {HttpCodes, USERS_TAG} from "../consts";
import { AuthService } from '../../../service-layer';
import {AuthResult} from "../../../domain";
import {RegisterRestDto, LoginRestV2Dto} from "../dtos";
import {AuthJwtService} from '../services/auth-jwt.service';
import { TokenDto } from "../interfaces/token-dto";
import { ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { ApiWebServerIsDownResponse } from "../decorators";

@ApiTags(USERS_TAG)
@Controller()
export class UserController {
  public constructor(
    private readonly authService: AuthService,
    private readonly authJwtService: AuthJwtService,
  ) {}

  @ApiOperation({
    summary: 'Регистрация пользователя',
  })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiWebServerIsDownResponse()
  @ApiCreatedResponse()
  @Version('1')
  @Post(USERS_TAG)
  async register(@Body() restDto: RegisterRestDto): Promise<AuthResult> {
    return await this
      .authService
      .register(
        restDto.login,
        restDto.password
      );
  }

  @ApiOperation({
    summary: 'Регистрация пользователя',
    description: 'Возвращается access_token',
  })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiCreatedResponse()
  @ApiWebServerIsDownResponse()
  @Version('2')
  @Post(USERS_TAG)
  async registerByJwt(@Body() restDto: RegisterRestDto): Promise<TokenDto> {
    return this.authJwtService.register(restDto.login, restDto.password);
  }

  @ApiOperation({
    summary: 'Аутентификация пользователя',
    description: 'Возвращается access_token',
  })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @ApiWebServerIsDownResponse()
  @HttpCode(HttpCodes.OK)
  @Version('2')
  @Post(`${USERS_TAG}/auth`) 
  async loginByJwt(@Body() body: LoginRestV2Dto): Promise<TokenDto> {
    return this.authJwtService.signIn(body.login, body.password);
  }
}
