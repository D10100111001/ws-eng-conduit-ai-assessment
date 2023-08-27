import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { RosterController } from "./roster.controller";
import { RosterService } from "./roster.service";

@Module({
  controllers: [
    RosterController,
  ],
  exports: [],
  imports: [MikroOrmModule.forFeature({ entities: [] }), UserModule],
  providers: [RosterService],
})
export class RosterModule {}
