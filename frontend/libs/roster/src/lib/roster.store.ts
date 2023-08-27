import { Injectable } from "@angular/core";
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from "@ngrx/component-store";
import { pipe } from "rxjs";
import { switchMap } from "rxjs/operators";
import { RosterService } from "./roster.service";
import { Roster } from "@realworld/core/api-types";

export interface RosterState {
  roster: Roster[];
}

@Injectable()
export class RosterStoreService extends ComponentStore<Roster>
  implements OnStateInit {
  constructor(private readonly rosterService: RosterService) {
    super({ authors: [] });
  }

  ngrxOnStateInit() {
    this.getRoster();
  }

  // SELECTORS
  roster$ = this.select((store) => store.authors);

  // EFFECTS
  readonly getRoster = this.effect<void>(
    pipe(
      switchMap(() =>
        this.rosterService.getRoster().pipe(
          tapResponse(
            (response) => {
              this.patchState(response);
            },
            (error) => {
              console.error("error getting tags: ", error);
            },
          ),
        )
      ),
    ),
  );
}
