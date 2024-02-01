import {Company} from "../../../domain";
import { IPagination } from "./pagination.interface";

export interface ICompanyRepository {
  findManyAndCount(skip: number, take: number): Promise<IPagination<Company>>,
  create(title: string, country: string): Promise<Company>;
  update(uuid: string, title: string, country: string): Promise<Company>;
  delete(uuid: string): Promise<void>;
}
