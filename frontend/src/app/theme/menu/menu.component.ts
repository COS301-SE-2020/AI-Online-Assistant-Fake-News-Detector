import { Component, EventEmitter, Input, Output } from '@angular/core'

import { Option } from '../option.model'
import { ThemeService } from '../theme.service'

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: [ './menu.component.css' ]
})
export class MenuComponent {
	@Input() options: Array<Option>
	@Output() themeChange: EventEmitter<string> = new EventEmitter<string>()

	constructor(private themeService: ThemeService) {}

	changeTheme(themeToSet) {
		this.themeChange.emit(themeToSet)
	}
}
