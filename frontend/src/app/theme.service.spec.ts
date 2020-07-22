import { ThemeService } from './theme.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';

beforeEach(() =>
	TestBed.configureTestingModule({
		imports: [ HttpClientTestingModule ]
	})
);

beforeEach(
	async(() => {
		TestBed.configureTestingModule({
			providers: [ ThemeService ]
		});
	})
);
