import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'

@Injectable({
	providedIn: 'root'
})
export class FindService {
	constructor(private http: HttpClient) {}

	find(content) {
		let body = {
			type: 'source',
			content: content
		}
		return this.http.post('https://jsonplaceholder.typicode.com/posts', body)
	}
}
