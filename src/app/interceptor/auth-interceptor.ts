import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpEvent
} from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from '@services/app.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private appService: AppService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token: string | null = localStorage.getItem('accessToken');
        if (token) {
            request = request.clone({
                setHeaders: {
                    authorization: `Bearer ${token}`,
                    // auth:`Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6Ijc1ZGZjYWViMmY4ZGRlZTAyZjU2MTRmYThhMjRkMmMyIn0.eyJ1c2VyX2lkIjoidXVpZGQxMjQzMiJ9.lkY3ctvaxcV2Jx0d88b4gn5TJmka09BC3slDZpALe1IqoIWi4wWVkJzSTuIIM2dX1WZjLgcmZJguO-Neaz4sBQ'}`
                    auth: `Bearer ${token}`
                }
            });
        }

        if (request.body instanceof FormData) {

        } else if (request.body instanceof URLSearchParams) {
            const modifiedHeaders = request.headers.set(
                'Content-Type', 'application/x-www-form-urlencoded');
            request = request.clone({
                headers: modifiedHeaders
            });

        }
        else if (typeof request.body === 'object' && request.body !== null) {

            // Assuming here that request.body is a JSON object
            const modifiedHeaders = request.headers.set(
                'Content-Type', 'application/json'
            );
            request = request.clone({
                headers: modifiedHeaders
            });

        }
        else {

            const modifiedHeaders = request.headers.set(
                'Content-Type',
                'application/x-www-form-urlencoded'
            );
            request = request.clone({ headers: modifiedHeaders });

        }
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log('An error occurred:', error);
                if (error.status === 408) {
                 
                    this.appService.logout();

                    this.router.navigate(['/login']); // Ensure this method clears the user session
             // Redirect to login page
                }
                return throwError(() => new Error('Something went wrong; please try again later.'));
            })
        );
    }

}
