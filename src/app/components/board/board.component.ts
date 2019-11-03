import { Component, Input, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
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
import { NotifierService } from 'angular-notifier';

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
    private readonly notifier: NotifierService;

    constructor(public el: ElementRef,
        private _ws: WebSocketService,
        notifierService: NotifierService,
        private _router: Router,
        private authenticationService: AuthenticationService,
        private _httpClient: HttpClient,
        private _route: ActivatedRoute,
        private renderer: Renderer2,
        ) {
            this.notifier = notifierService;
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

        this.httprequest = new HttpdatabaseService(this._httpClient, 'get_board/' + boardId, true);
        this.httprequest.getObj(this.authenticationService.currentUserValue.token)
            .subscribe((data: Board) => {
                this._ws.join(boardId);
                console.log(data);
                this.board = data;
                document.title = this.board.title + " | Generic Task Manager";
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

        

    ngOnDestroy(){
        if (this.board){
            console.log(`leaving board ${this.board._id}`);
            this._ws.leave(this.board._id);
        }
    }
    
    normalOptions: SortablejsOptions = {
        group: 'card-list',
    };

    updateBoard() {
        if (this.board.title && this.board.title.trim() !== '') {
            this.httprequest = new HttpdatabaseService(this._httpClient, 'update_board', true);
            this.httprequest.postObj(this.authenticationService.currentUserValue.token, this.board)
                .subscribe(() => {
                },
                error => {
                    this.notifier.notify(
                        "error",
                        error.message,
                        "THAT_NOTIFICATION_ID"
                    );
                }
            )

        } else {
            this.board.title = this.currentTitle;
        }
        this.editingTilte = false;
        document.title = this.board.title + " | Generic Task Manager";
    }

    // TODO on sort change!!

    editTitle() {
        this.currentTitle = this.board.title;
        this.editingTilte = true;

        let input = this.el.nativeElement
            .getElementsByClassName('board-title')[0]
            .getElementsByTagName('input')[0];
    }

    enableAddColumn() {
        this.addingColumn = true;
        setTimeout(()=>{ // this will make the execution after the above boolean has changed
            const element = this.renderer.selectRootElement('.add-column-input');
            if (element) {
                element.focus();
            }
          },0);  
    }

    addColumn() {
        let newColumn = <Column>{
            title: this.addColumnText,
            order: (this.board.columns.length + 1) * 1000,
            boardId: this.board._id
        };
        this.httprequest = new HttpdatabaseService(this._httpClient, 'add_column', true);
        this.httprequest.postObj(this.authenticationService.currentUserValue.token, newColumn)
            .subscribe((column:Column) => {
                this.board.columns.push(column)
                console.log('column added');
                this.addColumnText = '';
                this._ws.addColumn(this.board._id, column);
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

    addColumnOnEnter(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            if (this.addColumnText && this.addColumnText.trim() !== '') {
                this.addColumn();
            }
            else {
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

    forceUpdateCards() {
        var cards = JSON.stringify(this.board.cards);
        this.board.cards = JSON.parse(cards);
    }


    onCardUpdate(card: Card) {
        this.forceUpdateCards();
    }
}