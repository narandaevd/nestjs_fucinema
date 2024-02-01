import {DynamicModule, INestApplication, Module, ValidationPipe, VersioningType} from "@nestjs/common";
import {DatabaseModule} from "../../database";

import {NestFactory} from "@nestjs/core";
import {
  ActorModule,
  AuthJwtModule,
  CompanyModule,
  FilmModule, 
  LogModule, 
  ReportModule, 
  UserModule
} from "./modules";
import {CustomExceptionFilter} from "./exception.filter";

import {join} from 'path';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BackendHasntPermissionsException, DatabaseConnectionRefusedException, DatabaseIsReadonlyException, FilmAlreadyHasActorException, InvalidInputDataException, NotFoundException, NotUniqueInstanceException, ProfanityException, UnauthorizedException, UnknownException, UnknownInstanceException } from "../../exceptions";
import { HttpCodes } from "./consts";

@Module({})
export class MainModule {
  static register(): DynamicModule {

    const configsPath = join(process.cwd(), '..', '..', 'configs');
    const databaseConfigFileName = process.env.DATABASE_CONFIG_FILENAME || 'database.config.yml';

    return {
      module: MainModule,
      global: true,
      imports: [
        AuthJwtModule.forRoot(join(configsPath, 'auth.config.yml')),
        UserModule.register(join(configsPath, 'user.config.yml')),
        ReportModule.register(join(configsPath, 'report.config.yml')),
        FilmModule.register(join(configsPath, 'film.config.yml')),
        DatabaseModule.register(join(configsPath, databaseConfigFileName)),
        LogModule.register(join(configsPath, 'log.config.yml')),
        CompanyModule,
        ActorModule,
      ],
    }
  }
}

(async () => {
  const PORT = process.env.NODE_PORT || '3000';

  const app = await NestFactory.create<INestApplication>(MainModule.register());

  const exceptionMap: Record<string, number> = {
    [UnknownException.code]: HttpCodes.WEB_SERVER_IS_DOWN,
    [DatabaseConnectionRefusedException.code]: HttpCodes.INTERNAL_SERVER_ERROR,
    [InvalidInputDataException.code]: HttpCodes.CONFLICT,
    [NotFoundException.code]: HttpCodes.NOT_FOUND,
    [NotUniqueInstanceException.code]: HttpCodes.CONFLICT,
    [ProfanityException.code]: HttpCodes.CONFLICT,
    [UnauthorizedException.code]: HttpCodes.UNAUTHORIZED,
    [UnknownInstanceException.code]: HttpCodes.INTERNAL_SERVER_ERROR,
    [FilmAlreadyHasActorException.code]: HttpCodes.CONFLICT,
    [BackendHasntPermissionsException.code]: HttpCodes.INTERNAL_SERVER_ERROR,
    [DatabaseIsReadonlyException.code]: HttpCodes.INTERNAL_SERVER_ERROR,
  };

  app.enableVersioning({
    prefix: 'api/v',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.useGlobalFilters(new CustomExceptionFilter(exceptionMap));
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Fucinema')
    .addBearerAuth({
      type: 'http',
    })
    .setDescription('Идея проекта - создание сайта, который будет предоставлять информацию о фильмах. Для пользователей будет предоставляться возможность добавления отзывов.')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);

  console.log(`App listening ${PORT}`);
})();
