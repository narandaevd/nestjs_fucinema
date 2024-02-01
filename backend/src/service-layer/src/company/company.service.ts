import {Inject, Injectable} from "@nestjs/common";
import {COMPANY_REPOSITORY_TOKEN, ICompanyRepository, IPagination} from "../../../repository-contracts";
import {Company} from "../../../domain";

@Injectable()
export class CompanyService {
  public constructor(
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async getMany(skip: number, take: number): Promise<IPagination<Company>> {
    return this.companyRepository.findManyAndCount(skip, take);
  }

  async create(title: string, country: string): Promise<Company> {
    return await this.companyRepository.create(
      title,
      country
    );
  }

  async update(uuid: string, title: string, country: string): Promise<Company> {
    return await this.companyRepository.update(
      uuid,
      title,
      country
    );
  }

  async delete(uuid: string): Promise<void> {
    await this.companyRepository.delete(uuid); 
  }
}
