import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone, TemplateRef} from '@angular/core';
import { Card } from 'src/app/models/card';
import { WebSocketService } from 'src/app/services/ws.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gtm-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
    @Input()
    card: Card;
    @Output() cardUpdate: EventEmitter<Card>;
    editingCard = false;
    currentTitle: string;
    zone: NgZone;
    httprequest: HttpdatabaseService | null;
    closeResult: string;
    modalRef: BsModalRef;
    subscriptions: Subscription[] = [];

    constructor(private el: ElementRef,
        private _ref: ChangeDetectorRef,
        private _ws: WebSocketService,
        private authenticationService: AuthenticationService,
        private _httpClient: HttpClient,
        private modalService: BsModalService,
        ) {
        this.zone = new NgZone({ enableLongStackTrace: false });
        this.cardUpdate = new EventEmitter();
    }

    ngOnInit() {
        this._ws.onCardUpdate.subscribe((card: Card) => {
        if (this.card._id === card._id) {
            this.card.title = card.title;
            this.card.order = card.order;
            this.card.columnId = card.columnId;
        }
        });
    }

    blurOnEnter(event) {
        if (event.keyCode === 13) {
            event.target.blur();
        } else if (event.keyCode === 27) {
            this.card.title = this.currentTitle;
            this.editingCard = false;
        }
    }

    updateCard() {
        if (!this.card.title || this.card.title.trim() === '') {
            this.card.title = this.currentTitle;
        }

        this.httprequest = new HttpdatabaseService(this._httpClient, 'update_card', true);
        this.httprequest.postObj(this.authenticationService.currentUserValue.token, this.card)
            .subscribe((boards: Card) => {
                this._ws.updateCard(this.card.boardId, this.card);
            },
            error => {
                console.error(error.message);
            }
        )

        this.editingCard = false;
    }

    openModal(template: TemplateRef<any>, card: Card) {
        this.modalRef = this.modalService.show(template);

        console.log(card);

        this.subscriptions.push(
            this.modalService.onHide.subscribe((reason: string) => {
              const _reason = reason ? `, dismissed by ${reason}` : '';
              console.log(`onHide event has been fired${_reason}`);

              console.log(card);
              this.updateCard();
              
            })
          );
    }

    

    //TODO: check lifecycle
    private ngOnDestroy() {
        //this._ws.onCardUpdate.unsubscribe();
    }

}