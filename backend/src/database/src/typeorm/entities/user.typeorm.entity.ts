import {Column, Entity, PrimaryColumn} from "typeorm";

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
}
