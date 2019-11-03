import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {  AuthenticationService } from './services/authentication.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';  
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public translate: TranslateService,
    private titleService: Title
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      let lang = localStorage.getItem('language') || 'it';
      translate.setDefaultLang(lang);

      translate.onLangChange.subscribe((event: LangChangeEvent) => {
        translate.get('page_title').subscribe((res: string) => {
          titleService.setTitle(res);
        });
      });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  useLanguage(language: string) {
    localStorage.setItem('language', language);
    this.translate.use(language);
    this.translate.setDefaultLang(language);
  }


}
