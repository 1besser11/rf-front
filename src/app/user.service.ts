import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as JWT from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/users';
  private authUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient,
    private router: Router) { }

  

  getUser(id: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  loginUser(user: Object): Observable<Object> {
    return this.http.post(`${this.authUrl}/login`, user);
  }

  refresh(): Observable<Object> {
    let refresh = {"token" : localStorage.getItem('refresh_token')};
    return this.http.post(`${this.authUrl}/token`, refresh).pipe(tap((res => {
        
        var decoded = JWT(res["accessToken"]); 
        localStorage.setItem('scopes', decoded["scopes"].join());
        localStorage.setItem('access_token', res["accessToken"]);
        localStorage.setItem('refresh_token', res["refreshToken"]);
        })));
  }

  registerUser(user: Object): Observable<Object> {

    return this.http.post(`http://localhost:8080/auth/register`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.gotoLogin();
  }

  public get loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  getUsersList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
