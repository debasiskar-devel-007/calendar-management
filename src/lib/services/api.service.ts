/********************* Added By Himadri using Lamda start *************************/
​
​
import {ElementRef, EventEmitter, Injectable, Input, ViewChild} from '@angular/core';
import { switchMap, map, takeWhile } from 'rxjs/operators';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
​
@Injectable()
export class ApiService {
​
  public lengthis;
  public percentageis;
  public inprogress;
  public progress:any=[];
  public uploadtype;
  public uploaderror:any='';
  fileservername:any=[];
​
  private subjectForaddEndpointUrl = new Subject<any>();
​
​
  
  public getaddEndpoint(): Observable<any> {
    return this.subjectForaddEndpointUrl.asObservable();
  }
​
  constructor(private _http: HttpClient,
              private _authHttp: HttpClient
              ) {
               this.getaddEndpoint().subscribe(message => {
                  let result: any;
                   result = message;
                 });
              }
​
​
  isTokenExpired() { }
​
  getclientip() {
​
    var result = this._http.get("http://ipinfo.io/?format=json&token=9797c42b93078a").pipe(map(res => res));
​
    return result;
  }
​
​
​
  getEndpoint(link: any) {
​
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': ''
      })
    };
​
    var result = this._http.post(link, httpOptions).pipe(map(res => res));
​
    return result;
  }
​
  getData(link: any, data: any) {
​
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': ''
      })
    };
​
    var result = this._http.post(link, JSON.stringify(data), httpOptions).pipe(map(res => res));
​
    return result;
  }
​
  // getData end
​
  postData(endpoint:any, data:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': data.token
      })
    };
    var result = this._http.post(this.getEndpointUrl(endpoint), JSON.stringify(data), httpOptions).pipe(map(res => res));
    return result;
  }
  postDatawithoutToken(link:any, data:any ) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    var result = this._http.post(link, JSON.stringify(data), httpOptions).pipe(map(res => res));
    return result;
  }
​
  postlogin(link:any, data:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    var result = this._http.post(link, JSON.stringify(data), httpOptions).pipe(map(res => res));
    return result;
  } // postData end
​
​
  /* added by Himadri start */
  
  localJsonSate(link: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    var result = this._http.get( link, httpOptions).pipe(map(res => res));
    return result;
  }
  
  /* added by Himadri end */ 
​
​
  postSearch( link:any, token:string, source:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    var result = this._http.post(link, source, httpOptions).pipe(map(res => res));
    return result;
  }
postSearch1( link:any, source: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': source.token
      })
    };
    var result = this._http.post(link, source).pipe(map(res => res));
    return result;
  }
​
  putData(endpoint:any, data, id:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': ''
      })
    };
​
    var result = this._http.put(this.getEndpointUrl(endpoint)+'/'+id, JSON.stringify(data), httpOptions).pipe(map(res => res));
    return result;
  }
​
​
  deteOneData(endpoint:any, data:any ,token: any, source:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    let dataval:any;
    dataval={source:source,id:data._id}
    var result = this._http.post(endpoint, dataval, httpOptions).pipe(map(res => res));
    return result;
  }
​
    togglestatus(endpoint:any, data,token,source) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    let dataval:any;
    dataval={source:source,data:data}
    var result = this._http.post(endpoint,dataval, httpOptions).pipe(map(res => res));
    return result;
  }
​
  deteManyData(endpoint:any, data:any, token:any, source:any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    let dataval:any;
    dataval={source:source,ids:data}
    var result = this._http.post(endpoint+'many',dataval, httpOptions).pipe(map(res => res));
    return result;
  }
​
  togglestatusmany(endpoint:any, data,val,token,source) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    let dataval:any;
    dataval={source:source,data:{ids:data,val:val}};
    var result = this._http.post(endpoint+'many',dataval, httpOptions).pipe(map(res => res));
    return result;
  }
​
​
​
  private getEndpointUrl(endpoint: string) {
      return '' + endpoint;
  }
​
}
​
​
​
/********************* Added By Himadri using Lamda end *************************/