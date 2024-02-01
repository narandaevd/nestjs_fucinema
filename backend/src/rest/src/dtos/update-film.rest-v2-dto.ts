import { ApiProperty } from "@nestjs/swagger";
import {IsDefined, IsString} from "class-validator";

export class UpdateFilmRestV2Dto {

  @ApiProperty({
    description: 'Описание фильма',
  })
  @IsString()
  @IsDefined()
  public readonly description: string;
}
