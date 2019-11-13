import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { HttpClient } from '@angular/common/http';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';

@Component({
    selector: 'app-timesheet',
    templateUrl: './timesheet.component.html',
})
export class TimesheetComponent implements OnInit {
    httprequest: HttpdatabaseService | null;
    private readonly notifier: NotifierService;
    headers = [];
    data = [];
    total = [];

    constructor(
        private authenticationService: AuthenticationService,
        private _router: Router,
        private notifierService: NotifierService,
        private _httpClient: HttpClient,
    ) {
        this.notifier = notifierService;
     }
    ngOnInit() {

        this.headers = [];
        this.httprequest = new HttpdatabaseService(this._httpClient, 'api/get_week', true);
        this.httprequest.getObj(this.authenticationService.currentUserValue.token).subscribe((headers:any) => {
            this.headers = headers;
        },
        error => {
            this.notifier.notify(
                "error",
                error.message,
                "THAT_NOTIFICATION_ID"
            );
        });

        this.data = [];
        this.httprequest = new HttpdatabaseService(this._httpClient, 'api/get_week_data', true);
        this.httprequest.getObj(this.authenticationService.currentUserValue.token).subscribe((data:any) => {
            this.data = data;
            this.update_total_row();
        },
        error => {
            this.notifier.notify(
                "error",
                error.message,
                "THAT_NOTIFICATION_ID"
            );
        });
    }

    update_value() {
        this.save();
        this.update_total_row();
    }

    trackByFn(index: any, item: any) {
        return index;
    }

    update_total_row() {
        this.total = [];
        this.data.forEach((project, i) => {
            project.hours.forEach( (hour,j)=> {
                if (!this.total[j]){
                    this.total[j] = {
                        'class': '',
                        'hour': 0,
                    };
                }
                this.total[j]['hour'] += parseFloat(hour);
                if (this.total[j]['hour'] > 8){
                    this.total[j]['class'] = 'danger';
                }
                else if (this.total[j]['hour'] == 8){
                    this.total[j]['class'] = '';
                }
                else if (this.total[j]['hour'] < 8){
                    this.total[j]['class'] = 'success';
                }
            });
        });
    }

    save() {
        this.httprequest = new HttpdatabaseService(this._httpClient, 'save_timesheet', true);
        this.httprequest.postObj(this.authenticationService.currentUserValue.token, {'data':this.data}).subscribe((data:any) => {
        },
        error => {
            this.notifier.notify(
                "error",
                error.message,
                "THAT_NOTIFICATION_ID"
            );
        });
    }

}
