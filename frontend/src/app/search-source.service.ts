import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Sources } from './sources';

@Injectable({
	providedIn: 'root'
})
export class SearchSourceService {
	baseUrl: string = 'http://54.172.96.111:8080/api/sources/name/';
	//queryUrl: string = '?search=';

	constructor(private http: HttpClient) {}

	search(term: Observable<string>) {
		return this.http.get(this.baseUrl /*+ this.queryUrl */ + term).pipe(
			map((response: Sources[]) => {
				return response;
			}),
			catchError(error => {
				return throwError(/*'Something went wrong'*/error);
			})
		);
	}
}
