import {Injectable, EventEmitter} from '@angular/core';
import { Column } from '../models/column';
import { Card } from '../models/card';
import { environment } from 'src/environments/environment.cert';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class WebSocketService {
  public onColumnAdd: EventEmitter<Column>;
  public onCardAdd: EventEmitter<Card>;
  public onColumnUpdate: EventEmitter<Column>;
  public onCardUpdate: EventEmitter<Card>;

  constructor(private socket: Socket) {
    this.onColumnAdd = new EventEmitter();
    this.onCardAdd = new EventEmitter();
    this.onColumnUpdate = new EventEmitter();
    this.onCardUpdate = new EventEmitter();
  }

  connect(){ 

    this.socket.on('addColumn', data => {
      this.onColumnAdd.emit(<Column>data.column);
    });
    this.socket.on('addCard', data => {
      this.onCardAdd.emit(<Card>data.card);
    });
    this.socket.on('updateColumn', data => {
      this.onColumnUpdate.emit(<Column>data.column);
    });
    this.socket.on('updateCard', data => {
      this.onCardUpdate.emit(<Card>data.card);
    });
  }

  join(boardId: string) {
    this.socket.emit('joinBoard', boardId);
  }

  leave(boardId: string) {
    this.socket.emit('leaveBoard', boardId);
  }

  addColumn(boardId:string, column: Column){
    this.socket.emit('addColumn', { boardId: boardId, column: column });
  }

  addCard(boardId: string, card: Card) {
    this.socket.emit('addCard', { boardId: boardId, card: card });
  }

  updateColumn(boardId: string, column: Column) {
    this.socket.emit('updateColumn', { boardId: boardId, column: column });
  }

  updateCard(boardId: string, card: Card) {
    this.socket.emit('updateCard', { boardId: boardId, card: card });
  }
}