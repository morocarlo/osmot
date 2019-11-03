import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Board } from 'src/app/models/board';
import { WebSocketService } from 'src/app/services/ws.service';
import { Column } from 'src/app/models/column';
import { Card } from 'src/app/models/card';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { SortablejsOptions } from 'ngx-sortablejs';

var curYPos = 0,
    curXPos = 0,
    curDown = false;

@Component({
    selector: 'gtm-board',
    templateUrl: './board.component.html',
})

export class BoardComponent implements OnInit, OnDestroy {
    board: Board;
    addingColumn = false;
    addColumnText: string;
    editingTilte = false;
    currentTitle: string;
    boardWidth: number;
    columnsAdded: number = 0;
    httprequest: HttpdatabaseService | null;

    constructor(public el: ElementRef,
        private _ws: WebSocketService,
        private _router: Router,
        private authenticationService: AuthenticationService,
        private _httpClient: HttpClient,
        private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this._ws.connect();
        this._ws.onColumnAdd.subscribe(column => {
        console.log('adding column from server');
        this.board.columns.push(column);
        });

        this._ws.onCardAdd.subscribe(card => {
        console.log('adding card from server');
        this.board.cards.push(card);
        });

        let boardId = this._route.snapshot.params['id'];

        // TODO
        //let boardId = this._routeParams.get('id');
        this.httprequest = new HttpdatabaseService(this._httpClient, 'get_board/' + boardId, true);
        this.httprequest.getObj(this.authenticationService.currentUserValue.token)
            .subscribe((data: Board) => {
                this._ws.join(boardId);
                console.log(data);
                this.board = data;
                document.title = this.board.title + " | Generic Task Manager";
                this.setupView();        
                },
                error => {
                    console.error(error.message);
                }
            )

        }

    ngOnDestroy(){
        console.log(`leaving board ${this.board._id}`);
        this._ws.leave(this.board._id);
    }
    
    normalOptions: SortablejsOptions = {
        group: 'card-list',
    };

    setupView() {
        let component = this;
    }

    bindPane() {
        let el = document.getElementById('content-wrapper');
        el.addEventListener('mousemove', function (e) {
        e.preventDefault();
        if (curDown === true) {
            el.scrollLeft += (curXPos - e.pageX) * .25;// x > 0 ? x : 0;
            el.scrollTop += (curYPos - e.pageY) * .25;// y > 0 ? y : 0;
        }
        });

        el.addEventListener('mousedown', function (e) {
        if (e.srcElement['id'] === 'main' || e.srcElement['id'] === 'content-wrapper') {
            curDown = true;
        }
        curYPos = e.pageY; curXPos = e.pageX;
        });
        el.addEventListener('mouseup', function (e) {
        curDown = false;
        });
    }

    updateBoard() {
        if (this.board.title && this.board.title.trim() !== '') {
            // TODO
        //this._boardService.put(this.board);
        } else {
        this.board.title = this.currentTitle;
        }
        this.editingTilte = false;
        document.title = this.board.title + " | Generic Task Manager";
    }

    editTitle() {
        this.currentTitle = this.board.title;
        this.editingTilte = true;

        let input = this.el.nativeElement
        .getElementsByClassName('board-title')[0]
        .getElementsByTagName('input')[0];

        setTimeout(function () { input.focus(); }, 0);
    }

    updateColumnElements(column: Column) {
    /* let columnArr = jQuery('#main .column');
        let columnEl = jQuery('#main .column[columnid=' + column._id + ']');
        let i = 0;
        for (; i < columnArr.length - 1; i++) {
        column.order < +columnArr[i].getAttibute('column-order');
        break;
        }

        columnEl.remove().insertBefore(columnArr[i]);*/
    }

    updateColumnOrder(event) {
        /*let i: number = 0,
        elBefore: number = -1,
        elAfter: number = -1,
        newOrder: number = 0,
        columnEl = jQuery('#main'),
        columnArr = columnEl.find('.column');

        for (i = 0; i < columnArr.length - 1; i++) {
        if (columnEl.find('.column')[i].getAttribute('column-id') == event.columnId) {
            break;
        }
        }

        if (i > 0 && i < columnArr.length - 1) {
        elBefore = +columnArr[i - 1].getAttribute('column-order');
        elAfter = +columnArr[i + 1].getAttribute('column-order');

        newOrder = elBefore + ((elAfter - elBefore) / 2);
        }
        else if (i == columnArr.length - 1) {
        elBefore = +columnArr[i - 1].getAttribute('column-order');
        newOrder = elBefore + 1000;
        } else if (i == 0) {
        elAfter = +columnArr[i + 1].getAttribute('column-order');

        newOrder = elAfter / 2;
        }

        let column = this.board.columns.filter(x => x._id === event.columnId)[0];
        column.order = newOrder;*/


        // TODO
        /*this._columnService.put(column).then(res => {
        this._ws.updateColumn(this.board._id, column);
        });*/
    }


    blurOnEnter(event) {
        if (event.keyCode === 13) {
        event.target.blur();
        }
    }

    enableAddColumn() {
        this.addingColumn = true;
        /*let input = jQuery('.add-column')[0]
        .getElementsByTagName('input')[0];*/

    }

    addColumn() {
        let newColumn = <Column>{
        title: this.addColumnText,
        order: (this.board.columns.length + 1) * 1000,
        boardId: this.board._id
        };
        // TODO
        /*this._columnService.post(newColumn)
        .subscribe(column => {
            this.board.columns.push(column)
            console.log('column added');
            this.updateBoardWidth();
            this.addColumnText = '';
            this._ws.addColumn(this.board._id, column);
        });*/
    }

    addColumnOnEnter(event: KeyboardEvent) {
        if (event.keyCode === 13) {
        if (this.addColumnText && this.addColumnText.trim() !== '') {
            this.addColumn();
        } else {
            this.clearAddColumn();
        }
        }
        else if (event.keyCode === 27) {
        this.clearAddColumn();
        }
    }

    addColumnOnBlur() {
        if (this.addColumnText && this.addColumnText.trim() !== '') {
        this.addColumn();
        }
        this.clearAddColumn();
    }

    clearAddColumn() {
        this.addingColumn = false;
        this.addColumnText = '';
    }


    addCard(card: Card) {
        this.board.cards.push(card);
    }

    foreceUpdateCards() {
        var cards = JSON.stringify(this.board.cards);
        this.board.cards = JSON.parse(cards);
    }


    onCardUpdate(card: Card) {
        this.foreceUpdateCards();
    }
}