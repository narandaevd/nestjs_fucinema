import { ApiPropertyOptional } from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class UpdateActorRestV2Dto {

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;
}
