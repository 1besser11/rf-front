import { Injectable, LOCALE_ID, Inject  } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { UserService } from "./../user.service";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor( @Inject(LOCALE_ID) public localeId: string){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    //т.к HttpInterceptor перехватывает абсолютно все запросы мы должны гарантировать, что Authorization заголовок будет
    //добавлен только к запросам на наш API
    console.log(req.url);
    console.log("llll");

    console.log(this.localeId);
    console.log(req.url.includes('api'));
    if (!req.url.includes('api')) {
        const authReq = req.clone({
          headers: new HttpHeaders({
            'Accept-Language': this.localeId,
          })
        });
        console.log(req);
        return next.handle(authReq);
    }

    //клонироуем запрос, что бы добавить новый заголовок 
    const authReq = req.clone({
      headers: new HttpHeaders({
      'Accept-Language': this.localeId,
      'Authorization': "Bearer " + localStorage.getItem('access_token')
      })
    });
console.log(authReq);
    //передаем клонированный запрос место ориганального
    return next.handle(authReq);
  }
}
