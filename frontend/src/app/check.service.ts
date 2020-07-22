import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CheckService {
	constructor(private http: HttpClient) {}

	check(content) {
		let body = {
			type: 'source',
			content: content
		};
		return this.http.get<any>('http://localhost:8080/api/sources/' + content, { observe: 'response' });
	}

	getAllSources() {
		return this.http.get<any>('http://localhost:8080/api/sources/', { observe: 'response' });
	}

	getAllFacts() {
		return this.http.get<any>('http://localhost:8080/api/facts/', { observe: 'response' });
	}
}
