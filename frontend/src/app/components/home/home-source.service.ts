import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Sources } from "../../sources";

@Injectable({
  providedIn: "root",
})
export class HomeSourceService {
  baseUrl = "http://54.172.96.111:8080/api/Sources/";
  allSources: Sources[];
  constructor(private http: HttpClient) {
    this.getAll();
  }
  search(term: string) {
    return this.http.get(this.baseUrl + term).pipe(
      map((response: Sources[]) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  getAll() {
    this.http
      .get(this.baseUrl)
      .pipe(
        map((response: Sources[]) => {
          return response;
        }),
        catchError((error) => {
          return throwError(error);
        })
      )
      .subscribe((data) => (this.allSources = data));
  }
  // q from plug
  // getSources() {
  //   return this.http
  //     .get(this.baseUrl)
  //     .pipe(
  //       map((response: Sources[]) => {
  //         return response;
  //       }),
  //       catchError((error) => {
  //         return throwError(error);
  //       })
  //     );
  // }

  getSources() {
    return this.http.get(this.baseUrl);
  }
}