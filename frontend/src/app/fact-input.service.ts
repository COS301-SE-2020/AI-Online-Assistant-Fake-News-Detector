import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FactInputService {

  url = 'http://fakenewsdetector.tech/api/facts/';

  constructor(private _http: HttpClient) { }

  SubmitFact(userData) {
    return this._http.post<any>(this.url, userData)
}

}
