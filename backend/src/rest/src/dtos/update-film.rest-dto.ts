import {IsDefined, IsString} from "class-validator";

export class UpdateFilmRestDto {

  @IsString()
  @IsDefined()
  public readonly description: string;

  @IsString()
  @IsDefined()
  public readonly login: string;

  @IsString()
  @IsDefined()
  public readonly password: string;
}
