import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { trigger, style, transition, animate, group } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VersionComponent } from './components/version/version.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BoardComponent } from './components/board/board.component';
import { ColumnComponent } from './components/column/column.component';
import { CardComponent } from './components/card/card.component';
import { OrderBy } from './pipes/orderby.pipe';
import { Where } from './pipes/where.pipe';
import { WebSocketService } from './services/ws.service';
import { environment } from 'src/environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SortablejsModule } from 'ngx-sortablejs';
import { NotifierModule } from "angular-notifier";
import { ModalModule } from 'ngx-bootstrap/modal';
import { SubtaskComponent } from './components/subtask/subtask.component';
import { AvatarModule } from 'ngx-avatar';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TimesheetComponent } from './components/timesheet/timesheet.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const config: SocketIoConfig = { url: environment.ROOT_URL, options: {} };

@NgModule({
    declarations: [
        AppComponent,
        VersionComponent,
        LoginComponent,
        HomeComponent,
        DashboardComponent,
        BoardComponent,
        ColumnComponent,
        CardComponent,
        OrderBy,
        Where,
        SubtaskComponent,
        TimesheetComponent,
    ],
    imports: [
        BrowserModule,
        AvatarModule,
        PerfectScrollbarModule,
        AngularFontAwesomeModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SortablejsModule,
        NotifierModule,
        ModalModule.forRoot(),
        SocketIoModule.forRoot(config),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        WebSocketService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
    ],
    bootstrap: [AppComponent],
    entryComponents: []
})
export class AppModule { }
