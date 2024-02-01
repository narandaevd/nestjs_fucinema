import { ApiProperty } from "@nestjs/swagger";
import {IsDefined, IsUUID} from "class-validator";

export class AddActorToFilmRestV2Dto {
  
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  actorUuid: string;
}
