import { Component } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Option } from "./theme/option.model";
import { ThemeService } from "./theme/theme.service";
import { AuthService } from "./services/auth/auth.service";
import { WelcomeService } from './services/welcome.service';
import { MatSnackBar } from "@angular/material/snack-bar";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  tmp: string;
  title: string;
  options$: Observable<Array<Option>> = this.themeService.getThemeOptions();
  curTheme: string;
  showWelcome: boolean;
  user$: Observable<firebase.User> = this.auth.user$;
  constructor(
    private readonly themeService: ThemeService,
    public auth: AuthService,
    public welcome: WelcomeService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.themeService.setTheme("pink-bluegrey");
    this.curTheme = "pink-bluegrey";
    this.title = "ArtiFact";
    this.showWelcome = !welcome.hasBeenHere();
    if (!this.showWelcome) {
      this.snackBar.open(`Welcome back (° ͜ʖ͡°)`, "Close", {
        duration: 1500,
      });
    }
  }
  themeChangeHandler(themeToSet: string) {
    this.themeService.setTheme(themeToSet);
    this.curTheme = themeToSet;
  }
  closeWelcome(): void {
    this.showWelcome = false;
    this.welcome.store(true);
    document.getElementById('main').classList.add('scale-in-ver-bottom');
  }
}
