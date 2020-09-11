import { Component } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ShareSheetComponent } from "./share/sharesheet.component";

@Component({
  selector: "app-sharebutton",
  templateUrl: "./sharebutton.component.html",
  styleUrls: ["./sharebutton.component.css"],
})
export class ShareButtonComponent {
  constructor(private _bottomSheet: MatBottomSheet) {}

  openBottomSheet(): void {
    this._bottomSheet.open(ShareSheetComponent);
  }
}
