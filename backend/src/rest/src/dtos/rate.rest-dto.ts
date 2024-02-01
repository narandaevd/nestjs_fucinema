import {IsDefined, IsInt, IsOptional, IsString} from "class-validator";
import {IsGreaterThan, IsLessThan} from "../decorators";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RateRestDto {

  @ApiProperty({
    description: 'Содержимое отзыва',
  })
  @IsString()
  @IsDefined()
  public readonly content: string;

  @ApiPropertyOptional({
    description: 'Оценка сюжета',
  })
  @IsInt()
  @IsGreaterThan(0) // наверно вынести в конфиг
  @IsLessThan(6) // наверно вынести в конфиг
  @IsOptional()
  public readonly plotRate?: number;

  @ApiPropertyOptional({
    description: 'Оценка игры актёров',
  })
  @IsInt()
  @IsGreaterThan(0) // наверно вынести в конфиг
  @IsLessThan(6) // наверно вынести в конфиг
  @IsOptional()
  public readonly actorPlayRate?: number; 
}
