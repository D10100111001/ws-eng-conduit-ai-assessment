import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { UntilDestroy } from "@ngneat/until-destroy";
import { CommonModule } from "@angular/common";
import { RosterStoreService } from "./roster.store";
import { provideComponentStore } from "@ngrx/component-store";

@UntilDestroy()
@Component({
  selector: "cdt-roster",
  standalone: true,
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.css"],
  imports: [CommonModule],
  providers: [provideComponentStore(RosterStoreService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RosterComponent implements OnInit {
  roster$ = this.rosterStore.roster$;

  constructor(
    private readonly rosterStore: RosterStoreService,
  ) {}

  ngOnInit(): void {
  }
}
