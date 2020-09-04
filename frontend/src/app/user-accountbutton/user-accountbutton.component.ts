import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { MatTooltipModule, TooltipComponent } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
@Component({
  selector: "app-user-accountbutton",
  templateUrl: "./user-accountbutton.component.html",
  styleUrls: ["./user-accountbutton.component.css"],
})
export class UserAccountbuttonComponent implements OnInit {
  // signIn: boolean;
  // signUp: boolean;

  constructor(
    public auth: AuthService,
    public tool: MatTooltipModule,
    public menu: MatMenuModule
  ) {
    // this.signIn=true;
    // this.signUp=false;
  }

  ngOnInit(): void {}

  toggleForm() {
    // $event.stopPropagation();
    //   if (this.signIn) {
    //     this.signUp = true;
    //     this.signIn = false;
    //   } else if (this.signUp) {
    //     this.signIn = true;
    //     this.signUp = false;
    //   }
  }
}
