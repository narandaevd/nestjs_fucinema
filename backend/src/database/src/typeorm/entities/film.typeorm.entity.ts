import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import {CompanyTypeormEntity} from './company.typeorm.entity';
import { ActorTypeormEntity } from './actor.typeorm.entity';
import { ReportTypeormEntity } from './report.typeorm.entity';

@Entity({
  name: 'film',
})
export class FilmTypeormEntity {

  @PrimaryColumn({
    type: 'text',
  })
  uuid: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'text',
  })
  title: string;

  @ManyToOne(() => CompanyTypeormEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  company?: CompanyTypeormEntity;

  @Column({
    nullable: true,
  })
  companyUuid?: string;

  @ManyToMany(() => ActorTypeormEntity, a => a.films, {
    cascade: true
  })
  @JoinTable()
  actors?: ActorTypeormEntity[];

  @OneToMany(() => ReportTypeormEntity, r => r.film, {
    onDelete: 'CASCADE',
    cascade: true
  })
  reports?: ReportTypeormEntity[];
}
