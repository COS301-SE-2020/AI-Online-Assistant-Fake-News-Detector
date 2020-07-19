import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { NavComponent } from './nav/nav.component'
import { HomeComponent } from './components/home/home.component'
import { AboutComponent } from './components/about/about.component'
import { ModerateComponent } from './components/moderate/moderate.component'
import { HowtoComponent } from './components/howto/howto.component'
import { NotfoundComponent } from './notfound/notfound.component'

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: HomeComponent
	},
	{
		path: 'about',
		component: AboutComponent
	},
	{
		path: 'moderate',
		component: ModerateComponent
	},
	{
		path: 'howto',
		component: HowtoComponent
	},
	{
		path: '**',
		component: NotfoundComponent
	}
]

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
