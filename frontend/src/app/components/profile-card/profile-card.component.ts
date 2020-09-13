import { Component, EventEmitter, Input, Output } from "@angular/core";
import { WelcomeService } from '../../services/welcome.service';

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.css"],
})
export class ProfileCardComponent {
  @Input() user: firebase.User;
  @Output() logoutClick: EventEmitter<null> = new EventEmitter<null>();
  constructor(public welcome: WelcomeService) { }
  logout() {
    this.logoutClick.emit();
  }
}
