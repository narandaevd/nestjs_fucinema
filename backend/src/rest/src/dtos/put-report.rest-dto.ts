import { IsDefined, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import {IsGreaterThan, IsLessThan} from '../decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class PutReportRestDto {

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
    description: 'Uuid пользователя',
  })
  @IsUUID()
  @IsOptional()
  userUuid?: string;

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
