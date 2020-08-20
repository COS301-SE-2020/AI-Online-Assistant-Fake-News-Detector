import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SourceInputService {

  url = 'http://54.172.96.111:8080/api/sources/';

  constructor(private _http: HttpClient) { }

  SubmitSource(userData) {
    return this._http.post<any>(this.url, userData)
}
}
