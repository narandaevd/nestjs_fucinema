export class CreateReportDto {
  content: string;
  userUuid: string;
  filmUuid: string;
  plotRate?: number;
  actorPlayRate?: number;
}
