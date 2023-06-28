import {
  Report,
  UpdateReportDto
} from "../../../domain";

export interface IReportRepository {
  findOneByUserAndFilm(userUuid: string, filmUuid: string): Promise<Report>;
  save(report: Report): Promise<Report>;
  update(dto: UpdateReportDto): Promise<Report>;
}
