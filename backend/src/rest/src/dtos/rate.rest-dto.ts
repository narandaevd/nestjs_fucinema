import {IsDefined, IsInt, IsOptional, IsString} from "class-validator";
import {IsGreaterThan, IsLessThan} from "../decorators";

export class RateRestDto {
  
  @IsString()
  @IsDefined()
  public readonly content: string;

  @IsInt()
  @IsGreaterThan(0) // наверно вынести в конфиг
  @IsLessThan(6) // наверно вынести в конфиг
  @IsOptional()
  public readonly plotRate?: number;

  @IsInt()
  @IsGreaterThan(0) // наверно вынести в конфиг
  @IsLessThan(6) // наверно вынести в конфиг
  @IsOptional()
  public readonly actorPlayRate?: number; 
}
