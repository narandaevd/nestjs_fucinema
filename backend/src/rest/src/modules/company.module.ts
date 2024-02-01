import {Module} from "@nestjs/common";
import {DatabaseModule} from "../../../database";
import {CompanyController} from "../controllers";
import {CompanyService} from "../../../service-layer";

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    CompanyController,
  ],
  providers: [
    CompanyService,
  ],
})
export class CompanyModule {}
