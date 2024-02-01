import {Actor, User} from "../../../domain";
import { IPagination } from "./pagination.interface";

export interface IActorRepository {
  findManyAndCount(skip: number, take: number): Promise<IPagination<Actor>>,
  create(firstName: string, 
    lastName: string, middleName: string, 
    country: string
  ): Promise<Actor>;
  update(uuid: string, 
    firstName: string, 
    lastName: string, 
    middleName: string, 
    country: string
  ): Promise<Actor>;
  delete(uuid: string): Promise<void>;
}
