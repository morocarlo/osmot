import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Board } from 'src/app/models/board';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'gtm-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    boards: Board[];
    httprequest: HttpdatabaseService | null;

    constructor(
        private authenticationService: AuthenticationService,
        private _router: Router,
        private _httpClient: HttpClient,
    ) { }

    ngOnInit() {
        this.boards = [];

        this.httprequest = new HttpdatabaseService(this._httpClient, 'all_board', true);
        this.httprequest.getObj(this.authenticationService.currentUserValue.token)
            .subscribe((boards: Board[]) => {
                this.boards = boards;
            },
            error => {
                console.error(error.message);
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
                console.error(error.message);
            }
        )

    }

}