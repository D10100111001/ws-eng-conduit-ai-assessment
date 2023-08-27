import { ApiService } from "@realworld/core/http-client";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Roster } from "@realworld/core/api-types/src";

@Injectable({ providedIn: "root" })
export class RosterService {
  constructor(private apiService: ApiService) {}

  getRoster(): Observable<Roster> {
    return this.apiService.get("/roster");
  }
}
