import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Observable, Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserService } from "./../user.service";
import { finalize } from 'rxjs/operators';



type CallerRequest = {
    subscriber: Subscriber<any>;
    failedRequest: HttpRequest<any>;
};
 
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {


private refreshInProgress: boolean;
private requests: CallerRequest[] = [];
	
constructor(private http: HttpClient, private auth: UserService) { /*some init;*/ }

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  if(!req.url.includes('api/')) {
  return next.handle(req);
}

let observable = new Observable<HttpEvent<any>>((subscriber) => {

  let originalRequestSubscription = next.handle(req)
    .subscribe((response) => {

      subscriber.next(response);
    },
    (err) => {
      if (err.status === 401) {
        this.handleUnauthorizedError(subscriber, req);
      } else {
        subscriber.error(err);
      }
    },
    () => {
      subscriber.complete();
    });

    return () => {
      originalRequestSubscription.unsubscribe();
    };
  });

return observable;
}

private handleUnauthorizedError(subscriber: Subscriber < any >, request: HttpRequest<any>) {

  this.requests.push({ subscriber, failedRequest: request });
  if(!this.refreshInProgress) {
 
    this.refreshInProgress = true;
    this.auth.refresh()
      .pipe(finalize(() => {
        this.refreshInProgress = false;
      }))
      .subscribe((authHeader) =>{

        this.repeatFailedRequests();},
        () => {
          this.auth.logout();
        });
  }
}

private repeatFailedRequests() {

    this.requests.forEach((c) => {
      const requestWithNewToken = c.failedRequest.clone({
        headers: c.failedRequest.headers.set('Authorization', localStorage.getItem('access_token'))
      });
      this.repeatRequest(requestWithNewToken, c.subscriber);
    });
    this.requests = [];
  }

private repeatRequest(requestWithNewToken: HttpRequest < any >, subscriber: Subscriber<any>) {

    this.http.request(requestWithNewToken).subscribe((res) => {
      subscriber.next(res);
    },
      (err) => {
        if (err.status === 401) {
          this.auth.logout();
        }
        subscriber.error(err);
      },
      () => {
        subscriber.complete();
      });
  }
}
