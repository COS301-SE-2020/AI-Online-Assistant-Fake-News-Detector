import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeleteSourceService {

  url = 'http://fakenewsdetector.tech/api/sources/';

  constructor(private _http: HttpClient) { }

  SourceDeletion(ID) {
    return this._http.delete(this.url + ID)
}

}
