import {
  UpdateReportDto,
  Report
} from "../../../../domain";
import {IReportRepository} from "../../../../repository-contracts";
import { NotFoundException, UnknownException } from '../../../../exceptions';

import {Inject, Injectable} from "@nestjs/common";
import { ReportTypeormEntityMapper } from '../mappers/report.mapper';
import { ReportTypeormEntity } from '../entities/report.typeorm.entity';
import {InjectRepository} from "@nestjs/typeorm";
import { QueryFailedError, Repository } from 'typeorm';
import {ACL_ERROR_RESOLVER, CONNECTION_RESOLVER} from "../consts";
import {IConnectionRefusedResolver} from "../interfaces/connection-refused-resolver.interface";
import { PostgresError } from "pg-error-enum";
import { IAclCheckErrorResolver } from "../interfaces/acl-check-error-resolver.interface";

@Injectable()
export class ReportTypeormRepository implements IReportRepository {

  public constructor(
    @InjectRepository(ReportTypeormEntity)
    private readonly rawReportTypeormRepository: Repository<ReportTypeormEntity>,
    @Inject(CONNECTION_RESOLVER)
    private readonly resolver: IConnectionRefusedResolver,
    @Inject(ACL_ERROR_RESOLVER)
    private readonly aclErrorResolver: IAclCheckErrorResolver,
  ) {}

  async findOneByUserAndFilm(userUuid: string, filmUuid: string): Promise<Report> {
    const mapper = new ReportTypeormEntityMapper();
    const foundReport = await this.rawReportTypeormRepository.findOneBy({
      userUuid, filmUuid,
    });
    return mapper.toModel(foundReport);
  }

  async save(report: Report): Promise<Report> {
    try {
      const mapper = new ReportTypeormEntityMapper();
      const reportEntity = mapper.toEntity(report);
      await this
        .rawReportTypeormRepository
        .insert(reportEntity);
  
      const savedReportEntity = await this
        .rawReportTypeormRepository
        .findOneBy({uuid: report.uuid});
      return mapper.toModel(savedReportEntity);
    } catch (e: unknown) {
      this.resolver.throwIfConnectionRefused(e);
      this.aclErrorResolver.assertThatHasPermissions(e);
      if (e instanceof QueryFailedError && (e as any).code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new NotFoundException('Нет фильма с таким uuid');
      throw new UnknownException(e);
    }
  }

  async update(dto: UpdateReportDto): Promise<Report> {
    try {
      const mapper = new ReportTypeormEntityMapper();

      const foundReportEntity = await this
        .rawReportTypeormRepository
        .findOneBy({
          uuid: dto.uuid,
        });
  
      if (foundReportEntity == null)
        throw new NotFoundException('Нет отзыва с таким uuid');      
  
      await this
        .rawReportTypeormRepository
        .update(dto.uuid, {...dto});
  
      const updatedReportEntity = await this
        .rawReportTypeormRepository.findOneBy({
          uuid: dto.uuid,
        });
      return mapper.toModel(updatedReportEntity);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      if (e instanceof QueryFailedError && (e as any).code === PostgresError.FOREIGN_KEY_VIOLATION)
        throw new NotFoundException('Нет фильма с таким uuid');
      throw new UnknownException(e);
    }
  }
}
