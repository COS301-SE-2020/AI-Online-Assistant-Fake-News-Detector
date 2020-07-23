import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display project name', () => {
		page.navigateTo();
		expect(page.getTitle()).toEqual('AI News Detector');
	});

	it('api server is running o__O', () => {
		page.navigateTo();
		expect(page.testAPI()).toEqual('Source CNN is in our database!');
	});

	afterEach(async () => {
		// Assert that there are no errors emitted from the browser
		const logs = await browser.manage().logs().get(logging.Type.BROWSER);
		expect(logs).not.toContain(
			jasmine.objectContaining({
				level: logging.Level.SEVERE
			} as logging.Entry)
		);
	});
});
