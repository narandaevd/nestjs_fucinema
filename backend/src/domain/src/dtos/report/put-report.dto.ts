import {CreateReportDto} from "./create-report.dto";
import {UpdateReportDto} from "./update-report.dto";

export type PutReportDto = Partial<UpdateReportDto & CreateReportDto>; 
