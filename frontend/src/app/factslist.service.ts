import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as Rx from "rxjs/Rx";
import { from, Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { FactsList } from "./factslist";

@Injectable({
  providedIn: "root",
})
export class FactslistService {
  constructor(private http: HttpClient) {}

<<<<<<< Updated upstream
  url = "http://54.172.96.111:8080/api/facts/";
=======
  url = "https://artifacts.live/api/facts/";
>>>>>>> Stashed changes

  getFactsList() {
    return this.http.get(this.url).pipe(
      map((data: FactsList[]) => {
        return data;
      }),
      catchError((error) => {
        return throwError("Something went wrong");
      })
    );
  }
}
