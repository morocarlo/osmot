import {Component, OnInit, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef, NgZone, TemplateRef} from '@angular/core';
import { Card } from 'src/app/models/card';
import { WebSocketService } from 'src/app/services/ws.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { HttpdatabaseService } from 'src/app/services/httpdatabase.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'gtm-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
    @Input()
    card: Card;
    @Output() cardUpdate: EventEmitter<Card>;
    editingCard = false;
    zone: NgZone;
    httprequest: HttpdatabaseService | null;
    closeResult: string;
    modalRef: BsModalRef;
    subscriptions: Subscription[] = [];
    cardForm: FormGroup;
    private readonly notifier: NotifierService;

    constructor(private el: ElementRef,
        private _ref: ChangeDetectorRef,
        private _ws: WebSocketService,
        notifierService: NotifierService,
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private _httpClient: HttpClient,
        private modalService: BsModalService,
        ) {

            this.notifier = notifierService;
            this.zone = new NgZone({ enableLongStackTrace: false });
            this.cardUpdate = new EventEmitter();
            this.cardForm = this.formBuilder.group({
                title: ['', Validators.required],
                description: ['', Validators.required]
            });
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

    updateCard(serializedForm) {
        if (!this.card.title || this.card.title.trim() === '') {
            this.card.title = serializedForm.title;
        }

        this.httprequest = new HttpdatabaseService(this._httpClient, 'update_card', true);
        this.httprequest.postObj(this.authenticationService.currentUserValue.token, serializedForm)
            .subscribe((card: Card) => {
                this.card = card;
                this._ws.updateCard(this.card.boardId, this.card);
            },
            error => {
                this.notifier.notify(
                    "error",
                    error.message,
                    "THAT_NOTIFICATION_ID"
                );
            }
        )

        this.editingCard = false;
    }

    get f() { return this.cardForm.controls; }

    openModal(template: TemplateRef<any>, card: Card) {
        this.modalRef = this.modalService.show(template);

        this.f.title.setValue(card.title);
        this.f.description.setValue(card.description);

        this.subscriptions.push(
            this.modalService.onHide.subscribe((reason: string) => {
                const _reason = reason ? `, dismissed by ${reason}` : '';
                let formObj = this.cardForm.getRawValue(); // {name: '', description: ''}

                console.log(card, formObj);
                this.updateCard(formObj);
              
            })
          );
    }

    

    //TODO: check lifecycle
    private ngOnDestroy() {
        //this._ws.onCardUpdate.unsubscribe();
    }

}