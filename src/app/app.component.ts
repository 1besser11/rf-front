import { Component, LOCALE_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular App';
  languageList = [    { code: 'en', label: 'Eng' },    { code: 'uk', label: 'Укр' } ];
  constructor(@Inject(LOCALE_ID) protected localeId: string) { }

  public loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }
}
