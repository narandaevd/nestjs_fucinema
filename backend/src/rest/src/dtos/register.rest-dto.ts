import {IsDefined, IsString} from "class-validator";

export class RegisterRestDto {

  @IsString()
  @IsDefined()
  login: string;

  @IsString()
  @IsDefined()
  password: string;
}
