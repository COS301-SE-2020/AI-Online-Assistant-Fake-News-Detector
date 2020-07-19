import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FactInputService {

  _url = 'http://localhost:3000/facts/';

  constructor(private _http: HttpClient) { }

  SubmitFact(userData) {
    return this._http.post<any>(this._url, userData)
}

}
