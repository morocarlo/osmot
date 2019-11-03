import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {merge, Observable, of as observableOf} from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { User } from '../models';

export class HttpdatabaseService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept'       : 'application/json',
      'Authorization': '',
    })
  };

  href = '';
  
  constructor(private _httpClient: HttpClient, private apiName: string, private isTable: boolean ) {
    this.href = environment.apiUrl + this.apiName+'/';
  }

  getTable(sort: string, order: string, page: number, limit: number, userToken: string): Observable<TableApi> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Token ' + userToken);
    let requestUrl = this.href;
    if (this.isTable){
      requestUrl = `${this.href}?_sort=${sort}&_order=${order}&_page=${page + 1}&_limit=${limit}`; 
    }
    return this._httpClient.get<TableApi>(requestUrl, this.httpOptions);
  }

  getObj( userToken: string): Observable<Object> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Token ' + userToken);
    let requestUrl = this.href;
    return this._httpClient.get<Object>(requestUrl, this.httpOptions);
  }

  postObj( userToken: string, body: object): Observable<Object> {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Token ' + userToken);
    let requestUrl = this.href;
    return this._httpClient.post<Object>(requestUrl, body ,this.httpOptions);
  }

  loginUser(username: string, password: string): Observable<User> {
    let requestUrl = this.href;
    return this._httpClient.post<User>(requestUrl, { username, password }, this.httpOptions);
  }

}

export interface TableApi {
  items: Object[];
  total_count: number;
}