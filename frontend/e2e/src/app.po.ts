import { browser, by, element } from 'protractor';

export class AppPage {
	navigateTo(): Promise<unknown> {
		return browser.get(browser.baseUrl) as Promise<unknown>;
	}

	getTitle() {
		const titleText = element(by.css('.titleText'));
		if (titleText.isPresent) {
			return titleText.getText();
		}
	}

	testAPI() {
		const input = element(by.css('input'));
		if (input.isPresent) {
			input.sendKeys('CNN');
			const check = element(by.css('.checkBtn'));
			if (check.isPresent) {
				check.click();
				const cardTitle = element(by.css('mat-card-title'));
				if (cardTitle.isPresent) {
					return cardTitle.getText();
				}
			}
		}
	}
}
