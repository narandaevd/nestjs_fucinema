import { DynamicModule, Module } from "@nestjs/common";
import {JwtModule} from '@nestjs/jwt';
import { AUTH_JWT_CONFIGURATION_TOKEN, AuthJwtConfiguration, AuthJwtService } from "../services";
import { UserModule } from "./user.module";
import { AuthJwtConfig } from "../configs/auth-jwt.config";
import { BaseConfiguration, YamlReadStrategy } from "../../../config";

@Module({})
export class AuthJwtModule {

  static forRoot(configFilePath: string): DynamicModule {
    const authConfiguration: BaseConfiguration<AuthJwtConfig> = new AuthJwtConfiguration(new YamlReadStrategy());
    authConfiguration.readConfig(configFilePath);
    const authConfig = authConfiguration.getConfig();

    return {
      global: true,
      module: AuthJwtModule,
      imports: [
        UserModule,
        JwtModule.register({
          global: true,
          secret: authConfig.jwtSecret,
          signOptions: {
            expiresIn: authConfig.expiresIn,
          },
        }),
      ],
      providers: [
        {
          provide: AUTH_JWT_CONFIGURATION_TOKEN,
          useValue: authConfiguration,
        },
        AuthJwtService,
      ],
      exports: [
        AuthJwtService,
      ],
    };
  }
}
