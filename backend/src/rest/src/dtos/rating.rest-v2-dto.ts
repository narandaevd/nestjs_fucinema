import {IsDefined, IsInt, IsNumberString, IsOptional, IsString} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class RatingRestV2Dto {

  @ApiProperty({
    description: 'Содержимое отзыва',
  })
  @IsString()
  @IsDefined()
  public readonly content: string;

  @ApiPropertyOptional({
    description: 'Оценка сюжета',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumberString()
  public readonly plotRate?: number;

  @ApiPropertyOptional({
    description: 'Оценка игры актёров',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumberString()
  public readonly actorPlayRate?: number; 
}
