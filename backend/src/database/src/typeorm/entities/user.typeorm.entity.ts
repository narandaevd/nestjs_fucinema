import {Column, Entity, PrimaryColumn} from "typeorm";
import { Role } from "../../../../domain";

@Entity({name: 'user'})
export class UserTypeormEntity {
  
  @PrimaryColumn({
    type: 'uuid',
  })
  uuid: string;

  @Column({
    type: 'text',
    unique: true,
  })
  login: string;

  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'jsonb',
    default: '[]',
  })
  roles: Role[];
}
