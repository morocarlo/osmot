import { Component } from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {_} from 'ngx-translate-extract/dist/utils/utils';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';
import {HttpClient} from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  contact = undefined;
  contact_info = undefined;
  loading = false;
  loading_user = false;
  data: any;
  search_value: string;
  httprequest: HttpdatabaseService | null;

  constructor(public translate: TranslateService, private _httpClient: HttpClient,
    private titleService: Title, private authenticationService: AuthenticationService) { 
      
  }

  ngAfterViewInit() {
    
  };

  

}
