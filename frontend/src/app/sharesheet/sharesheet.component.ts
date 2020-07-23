import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-sharesheet',
	templateUrl: './sharesheet.component.html'
})
export class ShareSheetComponent {
	constructor(private _bottomSheetRef: MatBottomSheetRef<ShareSheetComponent>) {}

	openLink(event: MouseEvent, link: string): void {
		this._bottomSheetRef.dismiss();
		//enabling this will open links in a new tab
		//event.preventDefault();
		window.location.href = link;
		//this does new tab too if mouse event is ignored
		//window.open(link);
	}

	emailCurrentPage() {
		this._bottomSheetRef.dismiss();
		event.preventDefault();
		window.location.href = 'mailto:?subject=' + document.title + '&body=' + escape(window.location.href);
	}
}
