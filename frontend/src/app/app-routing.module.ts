import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from "@angular/fire/auth-guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { AboutComponent } from "./components/about/about.component";
import { ModerateComponent } from "./components/moderate/moderate.component";
import { HowtoComponent } from "./components/howto/howto.component";
import { NotfoundComponent } from "./notfound/notfound.component";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["home"]);

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
  },
  {
    path: "home",
    // possibly redirect here instead??
    // redirectTo: ''
    component: HomeComponent,
  },
  {
    path: "about",
    component: AboutComponent,
    data: { state: "about" },
  },
  {
    path: "moderate",
    component: ModerateComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "howto",
    component: HowtoComponent,
    data: { state: "howto" },
  },
  {
    path: "**",
    component: NotfoundComponent,
    data: { state: "notfound" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
