import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {IsDefined, IsOptional, IsString, IsUUID} from "class-validator";

export class CreateFilmRestV2Dto {

  @ApiProperty()
  @IsString()
  @IsDefined()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  companyUuid?: string;
}
