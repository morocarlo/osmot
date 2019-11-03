import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Board } from 'src/app/models/board';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'gtm-dashboard',
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {
    boards: Board[];
    httprequest: HttpdatabaseService | null;
    private readonly notifier: NotifierService;

    constructor(
        private authenticationService: AuthenticationService,
        private _router: Router,
        notifierService: NotifierService,
        private _httpClient: HttpClient,
    ) {
        this.notifier = notifierService;
     }

    ngOnInit() {
        this.boards = [];

        this.httprequest = new HttpdatabaseService(this._httpClient, 'all_board', true);
        this.httprequest.getObj(this.authenticationService.currentUserValue.token)
            .subscribe((boards: Board[]) => {
                this.boards = boards;
            },
            error => {
                this.notifier.notify(
                    "error",
                    error.message,
                    "THAT_NOTIFICATION_ID"
                );
            }
        )

    }

    public addBoard(){
        console.log('Adding new board');
        this.httprequest = new HttpdatabaseService(this._httpClient, 'new_board', true);
        this.httprequest.postObj(this.authenticationService.currentUserValue.token, { title: "New board" })
            .subscribe((board: Board) => {
                console.log(board)
                this._router.navigate(['/b', board._id]);
            },
            error => {
                this.notifier.notify(
                    "error",
                    error.message,
                    "THAT_NOTIFICATION_ID"
                );
            }
        )

    }

}