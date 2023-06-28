import {Column, Entity, JoinTable, ManyToMany, PrimaryColumn} from "typeorm";
import { FilmTypeormEntity } from './film.typeorm.entity';

@Entity({
  name: 'actor'
})
export class ActorTypeormEntity {

  @PrimaryColumn({
    type: 'text'
  })
  uuid: string;
  
  @Column({
    type: 'text'
  })
  firstName: string;

  @Column({
    type: 'text'
  })
  lastName: string;
  
  @Column({
    type: 'text',
    nullable: true,
  })
  middleName?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  country?: string;

  @ManyToMany(() => FilmTypeormEntity, f => f.actors)
  @JoinTable()
  films?: FilmTypeormEntity[];
} 
