import { IsDefined, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import {IsGreaterThan, IsLessThan} from '../decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PutReportRestV2Dto {

  @ApiProperty({
    description: 'Содержимое отзыва',
  })
  @IsDefined()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Uuid отзыва для изменения',
  })
  @IsUUID()
  @IsOptional()
  uuid?: string;

  @ApiPropertyOptional({
    description: 'Uuid фильма',
  })
  @IsUUID()
  @IsOptional()
  filmUuid?: string;

  @ApiPropertyOptional({
    description: 'Оценка сюжета',
  })
  @IsOptional()
  @IsInt()
  @IsGreaterThan(0)
  @IsLessThan(6) 
  plotRate?: number;

  @ApiPropertyOptional({
    description: 'Оценка игры актёров',
  })
  @IsOptional()
  @IsInt()
  @IsGreaterThan(0)
  @IsLessThan(6)
  actorPlayRate?: number;
}
