import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Board } from 'src/app/models/board';

@Component({
  selector: 'gtm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  boards: Board[];

  constructor(
      private _router: Router) { }

  ngOnInit() {
    this.boards = [];
    // TODO
    /*this._bs.getAll().subscribe((boards:Board[]) => {
      this.boards = boards;
    });*/
    setTimeout(function() {
    }, 100);
  }

  public addBoard(){
    console.log('Adding new board');
    // TODO
    /*this._bs.post(<Board>{ title: "New board" })
      .subscribe((board: Board) => {
        this._router.navigate(['/b', board._id]);
        console.log('new board added');
    });*/
  }

}