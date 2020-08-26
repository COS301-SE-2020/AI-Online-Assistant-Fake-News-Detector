import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-sharesheet',
	templateUrl: './sharesheet.component.html'
})
export class ShareSheetComponent {
	cantshare: boolean;
	constructor(private _bottomSheetRef: MatBottomSheetRef<ShareSheetComponent>) {
		// if (!navigator.share) {
		// 	console.log('Web Share API is not available in your browser.');
		// 	//this.cantshare = true;
		// } else {
		// 	this.cantshare = false;
		// }
	}

	openLink(event: MouseEvent, link: string): void {
		this._bottomSheetRef.dismiss();
		//enabling this will open links in a new tab
		event.preventDefault();
		//below does not open new tab
		//window.location.href = link;
		//this does new tab too if mouse event is ignored
		window.open(link);
	}

	mail(event: MouseEvent): void {
		this._bottomSheetRef.dismiss();
		event.preventDefault();
		window.open('mailto:5bits301@gmail.com?subject=Artifact [x__O]');
	}

	//not used currently
	emailCurrentPage() {
		this._bottomSheetRef.dismiss();
		event.preventDefault();
		window.open("mailto:?subject=' + document.title + '&body=' + escape(window.location.href)");
	}

	share(event: MouseEvent) {
		event.preventDefault();
		if (navigator.share) {
			navigator
				.share({
					title: 'ArtiFact',
					url: 'https://fakenewsdetector.tech'
				})
				.then(() => {
					console.log('Successful share');
					this._bottomSheetRef.dismiss();
				})
				.catch(error => console.log('Error sharing', error));
		} else {
			document.getElementById('other').innerHTML = 'Web Share API not supported';
			this.cantshare = true;
		}
	}

	async copy(event: MouseEvent) {
		try {
			await navigator.clipboard.writeText('https://ArtiFact.me');
			console.log('Page URL copied to clipboard');
			document.getElementById('copy').innerHTML = 'Link copied to clipboard';
			document.getElementById('copyicon').innerHTML = 'tag_faces';
		} catch (err) {
			console.error('Copy to clipboard failed: ', err);
			document.getElementById('copy').innerHTML = 'Failed to copy to clipboard';
			document.getElementById('copyicon').innerHTML = 'report';
		}
	}
}
