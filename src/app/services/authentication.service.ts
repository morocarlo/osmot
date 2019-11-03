import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models';
import { HttpdatabaseService } from './httpdatabase.service';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private userValue: any;
    loginDatabase: HttpdatabaseService | null;

    constructor(private _httpClient: HttpClient, private router: Router,) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        this.loginDatabase = new HttpdatabaseService(this._httpClient, 'login', true);
        return this.loginDatabase!.loginUser( username, password )
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user['token']) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    public logout() {
        // remove user from local storage to log user out
        this.loginDatabase = new HttpdatabaseService(this._httpClient, 'logout', true);
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login/']);
    }
}