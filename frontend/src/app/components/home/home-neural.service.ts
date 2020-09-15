import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class HomeNeuralService {
  baseUrl = "https://artifacts.live/api/verify/";
  constructor(private http: HttpClient, private snack: MatSnackBar) {}

  verify(contentt: string) {
    // const headers = { 'Authorization': 'Bearer my-token' }
    const body = { type: "text", content: contentt };
    return this.http.post<any>(this.baseUrl, body).pipe(
      map((data: any) => {
        return data.response;
      }),
      catchError((error) => {
        this.snack.open(`Something went wrong ಥ_ʖಥ`, "Close", {
          duration: 4000,
        });
        return throwError("Something went wrong");
      })
    );
  }
}
