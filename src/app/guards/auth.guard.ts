import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError, mapTo, switchMap, tap} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {NotificationService} from '@services/notification.service';
import {environment} from 'environments/environment';
import {lastValueFrom} from 'rxjs';
import {LoginInfo} from '@/models/loginInfo';
import {AppService} from '@services/app.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard  {
    public loginInfo: LoginInfo;
    public jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(
        private router: Router,
        private http: HttpClient,
        private notification: NotificationService,
        private appService: AppService
    ) {
        this.loginInfo = new LoginInfo();
    }

    canActivate(): Observable<boolean> {
        const token = localStorage.getItem('accessToken');

        if (token && !this.jwtHelper.isTokenExpired(token)) {
            return of(true);
        } else {
            return this.refreshTokenIfNeeded().pipe(
                switchMap((refreshed) => {
                    if (refreshed) {
                        // Token refresh successful, proceed with authentication
                        return of(true);
                    } else {
                        // Token refresh failed or not attempted, redirect to login
                        this.router.navigate(['/login']);
                        return of(false);
                    }
                })
            );
        }
    }

    private refreshTokenIfNeeded(): Observable<boolean> {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!token || !refreshToken) {
            return of(false);
        };

        const tokenModel = JSON.stringify({
            accessToken: token,
            refreshToken: refreshToken
        });

        return this.appService.refreshToken(tokenModel).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    return this.handleTokenExpired();
                } else {
                    // Handle other error cases
                    this.notification.showError(
                        'An error occurred while refreshing the token',
                        ''
                    );
                    this.appService.logout();
                    return of(false);
                }
            }),
            mapTo(true)
        );
    }

    private handleTokenExpired(): Observable<boolean> {
        const refreshToken = localStorage.getItem('refreshToken');

        // if (!refreshToken) {
        //     return this.handleLogout();
        // }

        return this.appService.refreshToken({refreshToken}).pipe(
            tap((response: LoginInfo) => {
                this.loginInfo = response;
                localStorage.setItem('accessToken', this.loginInfo.token);
                localStorage.setItem(
                    'refreshToken',
                    this.loginInfo.refreshToken
                );
                localStorage.setItem(
                    'LoginInfo',
                    JSON.stringify(this.loginInfo)
                );
                this.notification.showSuccess(
                    'Token renewed successfully',
                    'Success'
                );
            }),
            catchError(() => {
                alert('something went wrong');
                return this.handleLogout();
            }),
            mapTo(true)
        );
    }

    private handleLogout(): Observable<boolean> {
        this.appService.logout();
        return of(false);
    }
}
