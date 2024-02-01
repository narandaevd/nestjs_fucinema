import { ApiProperty } from "@nestjs/swagger";
import {IsOptional, IsString, IsDefined} from "class-validator";

export class CreateCompanyRestV2Dto {

  @ApiProperty()
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country: string;
}
