import { Component } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-sharesheet",
  templateUrl: "./sharesheet.component.html",
})
export class ShareSheetComponent {
  cantshare: boolean;
  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ShareSheetComponent>,
    private readonly snackBar: MatSnackBar
  ) {}
  openLink(event: MouseEvent, link: string): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
    window.open(link);
  }
  share(event: MouseEvent) {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: "ArtiFact",
          url: "https://fakenewsdetector.tech",
        })
        .then(() => {
          this.snackBar.open(`Thanks for sharing (◠﹏◠)`, "Close", {
            duration: 4000,
          });
          this._bottomSheetRef.dismiss();
        })
        .catch((error) => {} /*console.log("Error sharing", error)*/);
    } else {
      document.getElementById("other").innerHTML =
        "Web Share API not supported";
      this.cantshare = true;
    }
  }
  async copy(event: MouseEvent) {
    try {
      await navigator.clipboard.writeText("https://ArtiFact.me");
      // console.log("Page URL copied to clipboard");
      document.getElementById("copy").innerHTML = "Link copied to clipboard";
      document.getElementById("copyicon").innerHTML = "tag_faces";
    } catch (err) {
      console.error("Copy to clipboard failed: ", err);
      document.getElementById("copy").innerHTML = "Failed to copy to clipboard";
      document.getElementById("copyicon").innerHTML = "report";
    }
  }
}
