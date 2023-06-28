import {INestApplication, Module, ValidationPipe} from "@nestjs/common";
import {DatabaseModule} from "../../database";

import {NestFactory} from "@nestjs/core";
import {
  FilmModule, 
  LogModule, 
  ReportModule, 
  UserModule
} from "./modules";
import {CustomExceptionFilter} from "./exception.filter";

@Module({
  imports: [
    ReportModule.register('../../configs/report.config.yml'),
    UserModule.register('../../configs/user.config.yml'),
    FilmModule.register('../../configs/film.config.yml'),
    DatabaseModule.register('../../configs/database.config.yml'),
    LogModule.register('../../configs/log.config.yml'),
  ],
})
export class MainModule {}

(async () => {
  const PORT = '3000';

  const app = await NestFactory.create<INestApplication>(MainModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  console.log(`App listening ${PORT}`);

  await app.listen(PORT);
})();
