import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {IsDefined, IsOptional, IsString} from "class-validator";

export class CreateActorRestV2Dto {

  @ApiProperty()
  @IsString()
  @IsDefined()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  lastName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;
}
