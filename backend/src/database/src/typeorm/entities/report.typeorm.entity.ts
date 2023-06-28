import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserTypeormEntity } from './user.typeorm.entity';
import { FilmTypeormEntity } from './film.typeorm.entity';

@Entity({name: 'report'})
export class ReportTypeormEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  uuid: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  rate?: number;

  @Column({
    type: 'uuid',
  })
  userUuid: string;

  @ManyToOne(() => UserTypeormEntity, {
    cascade: true,
  })
  user?: UserTypeormEntity;

  @Column({
    type: 'uuid',
  })
  filmUuid: string;

  @ManyToOne(() => FilmTypeormEntity)
  @JoinColumn()
  film?: FilmTypeormEntity;
  
  @Column({
    type: 'int',
    nullable: true,
  })
  plotRate?: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  actorPlayRate?: number;
}
