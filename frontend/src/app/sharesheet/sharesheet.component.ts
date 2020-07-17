import { Component } from '@angular/core'
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'

@Component({
	selector: 'app-sharesheet',
	templateUrl: './sharesheet.component.html'
})
export class ShareSheetComponent {
	constructor(private _bottomSheetRef: MatBottomSheetRef<ShareSheetComponent>) {}

	openLink(event: MouseEvent): void {
		this._bottomSheetRef.dismiss()
		event.preventDefault()
	}
}
