import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Option } from '../../option.model';
import { ThemeService } from '../../theme.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.css' ]
})
export class HeaderComponent implements OnDestroy {
	mobileQuery: MediaQueryList;
	options$: Observable<Array<Option>> = this.themeService.getThemeOptions();
	curTheme: string;

	/* isMobile : boolean; */

	private _mobileQueryListener: () => void;

	constructor(
		private readonly themeService: ThemeService,
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher
	) {
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	//constructor(private readonly themeService: ThemeService) {}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}

	ngOnInit() {
		this.themeService.setTheme('pink-bluegrey');
		this.curTheme = 'pink-bluegrey';

		//defered this bit to the download plugin component, keeping it here because it might be hanndy

		/*
		var ua = navigator.userAgent;
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
			//mobile-other
			this.isMobile = true;
		} else if (/Chrome/i.test(ua)) {
			//chrome desktop
			this.isMobile = false;
		} else {
			//desktop-other
			this.isMobile = true;
		}
		*/
	}

	themeChangeHandler(themeToSet) {
		this.themeService.setTheme(themeToSet);
		this.curTheme = themeToSet;
	}
}
