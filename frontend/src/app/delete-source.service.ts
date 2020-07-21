import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteSourceService {

  _url = 'http://localhost:3000/sources/';

  constructor(private _http: HttpClient) { }

  SourceDeletion(ID) {
    return this._http.delete(this._url + ID)
}

}
