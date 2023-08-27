// roster.controller.ts
import { Controller, Get } from "@nestjs/common";
import { RosterService } from "./roster.service";

@Controller("roster")
export class RosterController {
  constructor(private readonly rosterService: RosterService) {}

  @Get()
  async getRoster() {
    return await this.rosterService.getRosterData();
  }
}
