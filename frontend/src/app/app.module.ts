import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { InputComponent } from './input/input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ReportService } from './report.service';
import { FindService } from './find.service';
import { CheckService } from './check.service';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ModerateComponent } from './components/moderate/moderate.component';
import { HowtoComponent } from './components/howto/howto.component';
import {SearchSourceService} from './search-source.service';
import {AutocompleteService} from 'src/app/autocomplete.service';

import { AiMaterialModule } from './app-material.module';
import { StyleManagerService } from './style-manager.service';
import { ThemeService } from './theme.service';
import { MenuComponent } from './menu/menu.component';
import { ShareButtonComponent } from './sharebutton/sharebutton.component';
import { ShareSheetComponent } from './sharesheet/sharesheet.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NotfoundComponent } from './notfound/notfound.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TogglebuttonComponent } from 'src/app/togglebutton/togglebutton.component';

@NgModule({
	declarations: [
		AppComponent,
		NavComponent,
		InputComponent,
		MenuComponent,
		HeaderComponent,
		FooterComponent,
		HomeComponent,
		AboutComponent,
		ModerateComponent,
		HowtoComponent,
		ShareSheetComponent,
		ShareButtonComponent,
		NotfoundComponent,
		TogglebuttonComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		LayoutModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatIconModule,
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
	],
	entryComponents: [ ShareButtonComponent, ShareSheetComponent ],
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
			useValue: { appearance: 'fill' }
		}
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
