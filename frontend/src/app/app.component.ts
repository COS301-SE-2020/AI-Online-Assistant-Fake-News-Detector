import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { Observable } from "rxjs/Observable";
import { Option } from "./theme/option.model";
import { ThemeService } from "./theme/theme.service";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnDestroy {
  title: string;
  mobileQuery: MediaQueryList;
  options$: Observable<Array<Option>> = this.themeService.getThemeOptions();
  curTheme: string;
  /* isMobile : boolean; */
  private _mobileQueryListener: () => void;
  constructor(
    private readonly themeService: ThemeService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public auth: AuthService
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.themeService.setTheme("pink-bluegrey");
    this.curTheme = "pink-bluegrey";

    this.title = "AiNews";
  }
  // constructor(private readonly themeService: ThemeService) {}
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  themeChangeHandler(themeToSet) {
    this.themeService.setTheme(themeToSet);
    this.curTheme = themeToSet;
  }
}
