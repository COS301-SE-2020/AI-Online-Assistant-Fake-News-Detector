import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Option } from './option.model';
import { StyleManagerService } from './style-manager.service';

@Injectable()
export class ThemeService {
	constructor(private http: HttpClient, private styleManager: StyleManagerService) {}

	getThemeOptions(): Observable<Array<Option>> {
		return this.http.get<Array<Option>>('assets/options.json');
	}

	setTheme(themeToSet) {
		this.styleManager.setStyle('theme', `assets/${themeToSet}.css`);
	}
}
