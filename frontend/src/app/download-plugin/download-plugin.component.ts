import { Component, OnInit } from "@angular/core";
import { DownloadPluginService } from "./download-plugin.service";
import { MatSnackBar } from "@angular/material/snack-bar";

// need this for migrating to svg later
// import { DomSanitizer } from '@angular/platform-browser';
// import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: "app-download-plugin",
  templateUrl: "./download-plugin.component.html",
  styleUrls: ["./download-plugin.component.css"],
})
export class DownloadPluginComponent implements OnInit {
  isMobile: boolean;

  // svg
  // constructor(private downloads: DownloadPluginService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
  // 	iconRegistry.addSvgIcon(
  // 		'error_outline',
  // 		sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/error_outline-black-18dp.svg')
  // 	);
  // }

  constructor(
    private downloads: DownloadPluginService,
    private readonly snackBar: MatSnackBar
  ) {}
  download(): void {
    // check browser support
    const ua = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        ua
      )
    ) {
      // mobile-other
      this.isMobile = true;
    } else if (/Chrome/i.test(ua)) {
      // chrome
      this.isMobile = false;
    } else {
      // desktop-other
      this.isMobile = true;
    }

    if (!this.isMobile) {
      this.downloads
        .download("/assets/downloads/plugin.zip")
        .subscribe((blob) => {
          const a = document.createElement("a");
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = "archive.zip";
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.snackBar.open(`Downloading Chrome extension ( ͡° ͜ʖ ͡°)`, "Close", {
            duration: 4000,
          });
        });
    } else {
      this.snackBar
        .open(`Your browser does not support the plugin (⊙︿⊙)`, "Close", {
          duration: 4000,
        })
        .afterDismissed()
        .subscribe(
          (response) =>
            response &&
            this.snackBar.open(
              `Try downloading in Chrome on your desktop ʕᵔᴥᵔʔ`,
              "Close",
              {
                duration: 4000,
              }
            )
        );
    }
  }
  ngOnInit(): void {
    this.isMobile = false;
  }
}
