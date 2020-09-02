import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// deprecated
// import { NavComponent } from './nav/nav.component'
import { HomeComponent } from "./components/home/home.component";
import { AboutComponent } from "./components/about/about.component";
import { ModerateComponent } from "./components/moderate/moderate.component";
import { HowtoComponent } from "./components/howto/howto.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "../app/components/login/login.component";

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
    canActivate: [AuthGuard],
    data: { state: "moderate" },
  },
  {
    path: "howto",
    component: HowtoComponent,
    data: { state: "howto" },
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { state: "notfound" },
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
