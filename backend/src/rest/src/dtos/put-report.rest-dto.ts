import { IsDefined, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import {IsGreaterThan, IsLessThan} from '../decorators';
export class PutReportRestDto {

  @IsDefined()
  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  uuid?: string;

  @IsUUID()
  @IsOptional()
  userUuid?: string;

  @IsUUID()
  @IsOptional()
  filmUuid?: string;

  @IsOptional()
  @IsInt()
  @IsGreaterThan(0)
  @IsLessThan(6) 
  plotRate?: number;

  @IsOptional()
  @IsInt()
  @IsGreaterThan(0)
  @IsLessThan(6)
  actorPlayRate?: number;

  @IsString()
  @IsDefined()
  public readonly login: string;

  @IsString()
  @IsDefined()
  public readonly password: string;
}
