import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  url = "https://artifacts.live/api/reports/";

  constructor(private _http: HttpClient) { }

  reportSource(source: string) {
    return this._http.post<any>(this.url, { type: "2", description: source });
  }
  reportFact(fact: string) {
    return this._http.post<any>(this.url, { type: "1", description: fact });
  }
}
