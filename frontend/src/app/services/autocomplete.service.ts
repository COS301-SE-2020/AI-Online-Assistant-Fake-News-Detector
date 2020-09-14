import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  tap,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from "rxjs/operators";
import { of, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AutocompleteService {
  constructor(private http: HttpClient) {}

  opts = [];

  getData() {
    return this.opts.length
      ? of(this.opts)
      : this.http
          .get<any>("https://artifacts.live/api/sources")
          .pipe(tap((data) => (this.opts = data)));
  }
}
