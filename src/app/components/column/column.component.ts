import {Component, Input, Output, OnInit, AfterViewInit, EventEmitter, ElementRef} from '@angular/core';
import {CardComponent} from '../card/card.component'
import { Column } from 'src/app/models/column';
import { Card } from 'src/app/models/card';
import { WebSocketService } from 'src/app/services/ws.service';
import { SortablejsOptions } from 'ngx-sortablejs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'gtm-column',
    templateUrl: './column.component.html',
})
export class ColumnComponent implements OnInit {
    @Input()
    column: Column;
    @Input()
    cards: Card[];
    @Output()
    public onAddCard: EventEmitter<Card>;
    @Output() cardUpdate: EventEmitter<Card>;

    editingColumn = false;
    addingCard = false;
    addCardText: string;
    currentTitle: string;
    httprequest: HttpdatabaseService | null;
    private readonly notifier: NotifierService;

    constructor(
        private el: ElementRef,
        private _ws: WebSocketService,
        private authenticationService: AuthenticationService,
        private _httpClient: HttpClient,
        notifierService: NotifierService,
        ){
            this.onAddCard = new EventEmitter();
            this.cardUpdate = new EventEmitter();
            this.notifier = notifierService;
    }

    ngOnInit() {
        this._ws.onColumnUpdate.subscribe((column: Column) => {
            if (this.column._id === column._id) {
                this.column.title = column.title;
                this.column.order = column.order;
            }
        });
    }

    normalOptions: SortablejsOptions = {
        group: 'card-list',
    };

    blurOnEnter(event) {
        if (event.keyCode === 13) {
        event.target.blur();
        }
    }

    addColumnOnEnter(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.updateColumn();
        } else if (event.keyCode === 27) {
            this.cleadAddColumn();
        }
    }

    addCard() {
        this.cards = this.cards || [];
        let newCard = <Card>{
            title: this.addCardText,
            order: (this.cards.length + 1) * 1000,
            columnId: this.column._id,
            boardId: this.column.boardId
        };

        this.httprequest = new HttpdatabaseService(this._httpClient, 'new_card', true);
        this.httprequest.postObj(this.authenticationService.currentUserValue.token, newCard)
            .subscribe((card:Card) => {
                this.onAddCard.emit(card);
                this._ws.addCard(card.boardId, card);
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

    addCardOnEnter(event: KeyboardEvent) {
        if (event.keyCode === 13) {
        if (this.addCardText && this.addCardText.trim() !== '') {
            this.addCard();
            this.addCardText = '';
        } else {
            this.clearAddCard();
        }
        } else if (event.keyCode === 27) {
        this.clearAddCard();
        }
    }

    updateColumn() {
        if (this.column.title && this.column.title.trim() !== '') {
        this.httprequest = new HttpdatabaseService(this._httpClient, 'update_column', true);
        this.httprequest.postObj(this.authenticationService.currentUserValue.token, this.column)
            .subscribe((card:Card) => {
                this.onAddCard.emit(card);
                this._ws.updateColumn(this.column.boardId, this.column);
            },
            error => {
                this.notifier.notify(
                    "error",
                    error.message,
                    "THAT_NOTIFICATION_ID"
                );
            }
        )

        this.editingColumn = false;
        } else {
        this.cleadAddColumn();
        }
    }

    cleadAddColumn() {
        this.column.title = this.currentTitle;
        this.editingColumn = false;
    }

    editColumn() {
        this.currentTitle = this.column.title;
        this.editingColumn = true;
        let input = this.el.nativeElement
        .getElementsByClassName('column-header')[0]
        .getElementsByTagName('input')[0];

        setTimeout(function() { input.focus(); }, 0);
    }

    enableAddCard() {
        this.addingCard = true;
        let input = this.el.nativeElement
        .getElementsByClassName('add-card')[0]
        .getElementsByTagName('input')[0];

        setTimeout(function() { input.focus(); }, 0);
    }


    updateColumnOnBlur() {
        if (this.editingColumn) {
        this.updateColumn();
        this.clearAddCard();
        }
    }


    addCardOnBlur() {
        if (this.addingCard) {
            if (this.addCardText && this.addCardText.trim() !== '') {
                this.addCard();
            }
        }
        this.clearAddCard();
    }

    clearAddCard() {
        this.addingCard = false;
        this.addCardText = '';
    }

    onCardUpdate(card: Card){
        this.cardUpdate.emit(card);
    }
    
}