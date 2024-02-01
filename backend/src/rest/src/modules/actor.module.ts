import {Module} from "@nestjs/common";
import {DatabaseModule} from "../../../database";
import {ActorController} from "../controllers";
import {ActorService} from "../../../service-layer";

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [
    ActorController,
  ],
  providers: [
    ActorService,
  ],
})
export class ActorModule {}
