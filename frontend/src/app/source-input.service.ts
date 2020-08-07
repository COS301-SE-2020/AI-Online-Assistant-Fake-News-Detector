import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SourceInputService {

  url = 'http://fakenewsdetector.tech/api/sources/';

  constructor(private _http: HttpClient) { }

  SubmitSource(userData) {
    return this._http.post<any>(this.url, userData)
}
}
