import { ApiProperty } from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class UpdateFilmRestDto {

  @ApiProperty({
    description: 'Описание фильма',
  })
  @IsString()
  @IsDefined()
  public readonly description: string;

  @ApiProperty({
    description: 'Логин пользователя',
  })
  @IsString()
  @IsDefined()
  public readonly login: string;

  @ApiProperty({
    description: 'Пароль пользователя',
  })
  @IsString()
  @IsDefined()
  public readonly password: string;
}
