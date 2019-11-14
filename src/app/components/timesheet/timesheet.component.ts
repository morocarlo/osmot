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
    current_week_delta = 0;
    view_format: string = 'week';
    is_users: string = '';
    users = [];
    current_user_id = '';
    can_edit = true;

    constructor(
        private authenticationService: AuthenticationService,
        private _router: Router,
        private notifierService: NotifierService,
        private _httpClient: HttpClient,
    ) {
        this.notifier = notifierService;
     }
    ngOnInit() {
        if (localStorage.getItem('view_format')){
            this.view_format = localStorage.getItem('view_format');
        }
        if (localStorage.getItem('is_users')){
            this.is_users = localStorage.getItem('is_users');
            if (this.is_users.indexOf('users') > -1){
                this.can_edit = false;
            }
            else {
                this.can_edit = true;
            }
        }
        
        this.httprequest = new HttpdatabaseService(this._httpClient, 'api/all_users' , true);
        this.httprequest.getObj(this.authenticationService.currentUserValue.token).subscribe((users:any) => {
            this.users = users;
        },
        error => {
            this.notifier.notify(
                "error",
                error.message,
                "THAT_NOTIFICATION_ID"
            );
        });

        this.change_week(0);
    }

    change_group_format(is_users){
        this.is_users = is_users;
        if (this.is_users.indexOf('users') > -1){
            this.can_edit = false;
        }
        else {
            this.can_edit = true;
        }
        localStorage.setItem('is_users', is_users);
        this.change_week(0);
    }

    change_user($event){
        this.current_user_id = $event.target.value;
        this.change_week(0);
    }

    change_view_format(view_format){
        this.view_format = view_format;
        localStorage.setItem('view_format', view_format);
        this.change_week(0);
    }

    change_week(delta){

        this.current_week_delta += parseInt(delta);
        this.headers = [];
        this.httprequest = new HttpdatabaseService(this._httpClient, 'api/get_'+this.view_format+'/' + this.current_week_delta  , true);
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
        this.httprequest = new HttpdatabaseService(this._httpClient, 'api/get_'+this.view_format+'_data/'  + this.current_week_delta + this.is_users + '?user_id=' + this.current_user_id , true);
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
                    this.total[j]['class'] = 'alert alert-danger';
                }
                else if (this.total[j]['hour'] == 8){
                    this.total[j]['class'] = '';
                }
                else if (this.total[j]['hour'] < 8){
                    this.total[j]['class'] = 'alert alert-success';
                }
            });
        });
    }

    save() {
        if (this.is_users.indexOf('users') > -1){
            return;
        }
        this.httprequest = new HttpdatabaseService(this._httpClient, 'api/save_timesheet_'+this.view_format+'/' + this.current_week_delta + '/?user_id=' + this.current_user_id, true);
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
