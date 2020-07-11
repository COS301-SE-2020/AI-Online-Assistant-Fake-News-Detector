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

@NgModule({
	declarations: [ AppComponent, NavComponent, InputComponent ],
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
		MatCardModule
	],
	providers: [ ReportService, FindService, CheckService, HttpClientModule ],
	bootstrap: [ AppComponent ]
})
export class AppModule {}