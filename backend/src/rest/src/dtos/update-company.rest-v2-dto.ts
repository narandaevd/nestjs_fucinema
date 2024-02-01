import { ApiProperty } from "@nestjs/swagger";
import {IsOptional, IsString} from "class-validator";

export class UpdateCompanyRestV2Dto {

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country: string;
}
