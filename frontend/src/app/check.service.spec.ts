import { TestBed } from '@angular/core/testing';

import { CheckService } from './check.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

beforeEach(() =>
	TestBed.configureTestingModule({
		imports: [ HttpClientTestingModule ]
	})
);
// describe('CheckService', () => {
//   let service: CheckService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(CheckService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
