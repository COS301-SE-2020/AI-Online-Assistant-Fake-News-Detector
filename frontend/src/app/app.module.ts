import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { ReportService } from "./report.service";
import { FindService } from "./find.service";
import { CheckService } from "./check.service";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";

import { HttpClientModule } from "@angular/common/http";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./components/home/home.component";
import { AboutComponent } from "./components/about/about.component";
import { ModerateComponent } from "./components/moderate/moderate.component";
import { HowtoComponent } from "./components/howto/howto.component";
import { SearchSourceService } from "./search-source.service";
import { AutocompleteService } from "./services/autocomplete.service";
import { DownloadPluginComponent } from "./download-plugin/download-plugin.component";

import { AiMaterialModule } from "./app-material.module";
import { StyleManagerService } from "./theme/style-manager.service";
import { ThemeService } from "./theme/theme.service";
import { MenuComponent } from "./theme/menu/menu.component";
import { ShareButtonComponent } from "./share/sharesharebutton.component";
import { ShareSheetComponent } from "./share/sharesheet.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { NotfoundComponent } from "./notfound/notfound.component";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatBottomSheet,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { TogglebuttonComponent } from "src/app/components/moderate/togglebutton/togglebutton.component";
import { UserAccountbuttonComponent } from "src/app/user-accountbutton/user-accountbutton.component";
// import { LoginComponent } from "src/app/user-accountbutton/login/login.component";
// import { SignUpComponent } from "src/app/user-accountbutton/sign-up/sign-up.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { AppFirebaseModule } from "./app-firebase.module";

import { ProfileCardComponent } from "./components/profile-card/profile-card.component";
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ModerateComponent,
    HowtoComponent,
    ShareSheetComponent,
    ShareButtonComponent,
    NotfoundComponent,
    TogglebuttonComponent,
    UserAccountbuttonComponent,
    DownloadPluginComponent,
    ProfileCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    MatCardModule,
    AiMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatProgressBarModule,
	AppFirebaseModule,
	NgxGaugeModule,
	NgxChartsModule
  ],
  entryComponents: [ShareButtonComponent, ShareSheetComponent],
  providers: [
    ReportService,
    FindService,
    CheckService,
    HttpClientModule,
    StyleManagerService,
    ThemeService,
    SearchSourceService,
    AutocompleteService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "fill" },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
