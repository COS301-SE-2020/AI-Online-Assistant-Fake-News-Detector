import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DeleteSourceService {
  url = "https://artifacts.live/api/sources/id/";

  constructor(private _http: HttpClient) {}

  SourceDeletion(ID) {
    return this._http.delete(this.url + ID);
  }
}
