import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { FilmTypeormEntity } from './film.typeorm.entity';

@Entity({name: 'company'})
export class CompanyTypeormEntity {
  @PrimaryColumn({
    type: 'uuid'
  })
  uuid: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  country?: string;

  @Column({
    type: 'text',
  })
  title: string;

  @OneToMany(() => FilmTypeormEntity, f => f.company, {
    onDelete: 'CASCADE',
  })
  film?: FilmTypeormEntity;
}
