import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {Company} from "../../../../domain";
import {ICompanyRepository, IPagination} from "../../../../repository-contracts";
import {CompanyTypeormEntity} from "../entities";
import {CompanyTypeormEntityMapper} from "../mappers";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ACL_ERROR_RESOLVER, CONNECTION_RESOLVER } from "../consts";
import { IConnectionRefusedResolver } from "../interfaces/connection-refused-resolver.interface";
import { UnknownException } from "../../../../exceptions";
import { IAclCheckErrorResolver } from "../interfaces/acl-check-error-resolver.interface";

@Injectable()
export class CompanyTypeormRepository implements ICompanyRepository {
  public constructor(
    @InjectRepository(CompanyTypeormEntity)
    private readonly repo: Repository<CompanyTypeormEntity>,
    @Inject(CONNECTION_RESOLVER)
    private readonly resolver: IConnectionRefusedResolver,
    @Inject(ACL_ERROR_RESOLVER)
    private readonly aclErrorResolver: IAclCheckErrorResolver,
  ) {}
  
  async findManyAndCount(skip: number, take: number): Promise<IPagination<Company>> {

    try {
      const qb = this.repo
        .createQueryBuilder('c')
        .select('c')
        .skip(skip)
        .take(take);

      const [data, count] = await qb.getManyAndCount();
      const mapper = new CompanyTypeormEntityMapper();
      return {
        data: data.map(e => mapper.toModel(e)), 
        count
      };
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }

  async create(title: string, country: string): Promise<Company> {
    try {
      const company = new Company(title);
      if (country)
        company.country = country;
      const mapper = new CompanyTypeormEntityMapper();
      await this.repo.save(mapper.toEntity(company));
      return company;
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
  async update(uuid: string, title: string, country: string): Promise<Company> {
    try {
      const entity = await this.repo.findOneBy({uuid});
      if (!entity)
        throw new NotFoundException('Не найдена студия с таким uuid');
      await this.repo.update(uuid, {title, country});
      const newEntity = await this.repo.findOneBy({uuid});
      const mapper = new CompanyTypeormEntityMapper();
      return mapper.toModel(newEntity);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
  async delete(uuid: string): Promise<void> {
    try {
      await this.repo.delete(uuid);
    } catch (e: unknown) {
      this.aclErrorResolver.assertThatHasPermissions(e);
      this.resolver.throwIfConnectionRefused(e);
      throw new UnknownException(e);
    }
  }
}
