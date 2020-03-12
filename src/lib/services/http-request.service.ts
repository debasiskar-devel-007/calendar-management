import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HttpRequestService {

  constructor(private http: HttpClient) {

  }

  /* call api via post method */
  httpViaPost(endpoint, jsonData): Observable<any> {
    /* set common header */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jsonData.token
      })
    };
    return this.http.post(endpoint, jsonData);
  }

  /* call api via get method */
  httpViaGet(endpoint, jsonData): Observable<any> {
    /* set common header */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': jsonData.token
      })
    };
    return this.http.get(endpoint, jsonData);
  }

}
