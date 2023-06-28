import {
  CreateReportDto, 
  PutReportDto,
  UpdateReportDto,
  RateBody,
  AuthResultCode,
  ReportFactory,
  Report
} from "../../../../domain";
import {NotFoundException, UnauthorizedException} from "../../../../exceptions";
import {
  IReportRepository, 
  REPORT_REPOSITORY_TOKEN
} from "../../../../repository-contracts";
import { InvalidInputDataException } from '../../../../exceptions';

import {ERROR_SERVICE, IErrorService} from "../../common";
import {AuthService} from "../../user/services/auth.service";
import {IReportRaterService} from "../interfaces";
import {Inject, Injectable} from "@nestjs/common";
import {REPORT_RATER_SERVICE_TOKEN} from "../consts";
import {ILogService, LOG_SERVICE} from "../../log-contract";

@Injectable()
export class ReportService {
  public constructor(
    @Inject(REPORT_REPOSITORY_TOKEN)
    private readonly reportRepository: IReportRepository,
    @Inject(REPORT_RATER_SERVICE_TOKEN)
    private readonly reportRaterService: IReportRaterService,
    private readonly authService: AuthService,
    @Inject(LOG_SERVICE)
    private readonly logService: ILogService,
    @Inject(ERROR_SERVICE)
    private errorService: IErrorService,
  ) {}

  public async put(
    dto: PutReportDto,
    login: string,
    password: string
  ): Promise<Report> {
    const loginRes = await this.authService.login(login, password);
    if (loginRes.code === AuthResultCode.Failure) {
      const msg = 'Логин или пароль неверные';
      await this.logService.warning({
        login,
        action: 'Оставить отзыв'
      }, msg);
      throw new UnauthorizedException(msg);
    }

    let report: Report;
    try {
      report = await this
        .reportRepository
        .findOneByUserAndFilm(loginRes.user.uuid, dto.filmUuid);
    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      await this.errorService.logAndThrowIfUnknown(e);
    }

    if (report) {
      dto.uuid = report.uuid;
      const newDto: UpdateReportDto = this.mapPutDtoToUpdateDto(dto, loginRes.user.uuid);
      return await this.update(newDto);
    } else {
      const newDto: CreateReportDto = this.mapPutDtoToCreateDto(dto, loginRes.user.uuid);
      return await this.create(newDto);
    }
  }

  private mapPutDtoToUpdateDto(dto: PutReportDto, userUuid: string): UpdateReportDto {
    if (!dto.uuid) {
      throw new InvalidInputDataException('Не был задан uuid');
    }
    const updateDto: UpdateReportDto = {
      uuid: dto.uuid,
      userUuid,
    };
    if (dto.content)
      updateDto.content = dto.content;
    if (dto.plotRate)
      updateDto.plotRate = dto.plotRate;
    if (dto.actorPlayRate)
      updateDto.actorPlayRate = dto.actorPlayRate;
    if (dto.rate)
      updateDto.rate = dto.rate;
    return updateDto;
  }

  private mapPutDtoToCreateDto(dto: PutReportDto, userUuid: string): CreateReportDto {
    if (!dto.content) {
      throw new InvalidInputDataException('Содержание отзыва не может быть пустым');
    }
    if (!dto.filmUuid) {
      throw new InvalidInputDataException('Не был задан filmUuid');
    }
    let createDto: CreateReportDto = {
      content: dto.content,
      filmUuid: dto.filmUuid,
      userUuid,
    };
    if (dto.plotRate)
      createDto.plotRate = dto.plotRate;
    if (dto.actorPlayRate)
      createDto.actorPlayRate = dto.actorPlayRate;
    return createDto;
  }

  private async create(dto: CreateReportDto): Promise<Report> {
    await this.logService.debug({
      user: dto.userUuid,
      film: dto.filmUuid,
      body: {
        content: dto.content,
        actorPlayRate: dto.actorPlayRate,
        plotRate: dto.plotRate,
      },
      operation: 'Создание отзыва',
    });
    const rep = ReportFactory.createFromDto(dto);
    rep.rate = this.reportRaterService.rate(rep).rating;
    try {
      return await this.reportRepository.save(rep);
    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      if (e instanceof NotFoundException) {
        await this.logService.warning(e);
        throw e;
      }
      await this.errorService.logAndThrowIfUnknown(e);
    }
  }

  private async update(dto: UpdateReportDto): Promise<Report> {
    const body = new RateBody(
      dto.content,
      dto.plotRate,
      dto.actorPlayRate
    );
    await this.logService.debug({
      user: dto.userUuid,
      film: dto.filmUuid,
      body: body,
      operation: 'Обновление отзыва',
    });
    dto.rate = this.reportRaterService.rate(body).rating;
    try {
      return await this.reportRepository.update(dto);
    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      if (e instanceof NotFoundException) {
        await this.logService.warning(e);
        throw e;
      }
      await this.errorService.logAndThrowIfUnknown(e);
    }
  }
}
