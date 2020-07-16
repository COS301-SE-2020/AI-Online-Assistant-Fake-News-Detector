import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NavComponent } from './nav/nav.component'
import { LayoutModule } from '@angular/cdk/layout'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { InputComponent } from './input/input.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { ReportService } from './report.service'
import { FindService } from './find.service'
import { CheckService } from './check.service'
import { MatCardModule } from '@angular/material/card'

import { HttpClientModule } from '@angular/common/http'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { HomeComponent } from './components/home/home.component'
import { AboutComponent } from './components/about/about.component'
import { ModerateComponent } from './components/moderate/moderate.component'
import { HowtoComponent } from './components/howto/howto.component'

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AiMaterialModule } from './app-material.module'
import { StyleManagerService } from './style-manager.service'
import { ThemeService } from './theme.service'
import { MenuComponent } from './menu/menu.component'
import { ShareButtonComponent } from './sharebutton/sharebutton.component'
import { ShareSheetComponent } from './sharesheet/sharesheet.component'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'

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
		ShareButtonComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
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
		AiMaterialModule
	],
	entryComponents: [ ShareButtonComponent, ShareSheetComponent ],
	providers: [
		ReportService,
		FindService,
		CheckService,
		HttpClientModule,
		StyleManagerService,
		ThemeService,
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
