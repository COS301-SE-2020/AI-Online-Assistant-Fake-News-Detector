import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  url = "https://artifacts.live/api/stats";

  constructor(private http: HttpClient) {}

  getStats() {
    return this.http.get(this.url).pipe(
      map((data: any) => {
        return data;
      }),
      catchError((error) => {
        return throwError("Something went wrong");
      })
    );
  }
}
