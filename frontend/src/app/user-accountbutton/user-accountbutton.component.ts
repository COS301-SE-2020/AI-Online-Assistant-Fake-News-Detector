import { Component } from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { AuthService } from "../services/auth/auth.service";
import { MatTooltipModule, TooltipComponent } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

import { EMPTY, Observable, of } from "rxjs";
import { catchError, take } from "rxjs/operators";
// import { toTypeScript } from "@angular/compiler";

@Component({
  selector: "app-user-accountbutton",
  templateUrl: "./user-accountbutton.component.html",
  styleUrls: ["./user-accountbutton.component.css"],
})
export class UserAccountbuttonComponent {
  // signIn: boolean;
  // signUp: boolean;
  user$: Observable<firebase.User> = this.auth.user$;
  constructor(
    private readonly auth: AuthService,
    public tool: MatTooltipModule,
    public menu: MatMenuModule,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  login() {
    this.auth
      .loginViaGoogle()
      .pipe(
        take(1),
        catchError((error) => {
          this.snackBar.open(`${error.message}: Couldn't sign in`, "Close", {
            duration: 4000,
          });
          return EMPTY;
        })
      )
      .subscribe(
        (response) =>
          response &&
          this.snackBar.open(`Welcome to Artifact (ಠ ‿ ಠ)`, "Close", {
            duration: 4000,
          })
      );
  }

  logout() {
    this.auth
      .logout()
      .pipe(take(1))
      .subscribe((response) => {
        this.router.navigate([`/${"home"}`]);
        this.snackBar.open("Come back soon ( ఠ ͟ʖ ఠ)", "Close", {
          duration: 4000,
        });
      });
  }
}
