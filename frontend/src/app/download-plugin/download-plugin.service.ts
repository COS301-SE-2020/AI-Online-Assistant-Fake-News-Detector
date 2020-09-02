import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DownloadPluginService {

  constructor(private http: HttpClient) {}

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }
}
