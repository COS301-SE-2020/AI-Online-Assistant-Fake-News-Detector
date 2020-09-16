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
  baseUrl = "https://artifacts.live/api/sources/";
  // queryUrl: string = '?search=';
  allSources: Sources[];
  constructor(private http: HttpClient) { }
  search(term: Observable<string>) {
    return this.http.get(this.baseUrl /*+ this.queryUrl */ + term).pipe(
      map((response: Sources[]) => {
        return response;
      }),
      catchError((error) => {
        return throwError(/*'Something went wrong'*/ error);
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
          return throwError(/*'Something went wrong'*/ error);
        })
      )
      .subscribe((data) => (this.allSources = data));
  }
}