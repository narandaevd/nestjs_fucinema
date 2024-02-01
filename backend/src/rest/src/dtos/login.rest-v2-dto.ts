import { ApiProperty } from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class LoginRestV2Dto {

  @ApiProperty({
    description: 'Логин пользователя',
  })
  @IsString()
  @IsDefined()
  login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
  })
  @IsString()
  @IsDefined()
  password: string;
}
