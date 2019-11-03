import { Component, OnInit, Input } from '@angular/core';
import { Subtask } from 'src/app/models/subtask';

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
})
export class SubtaskComponent implements OnInit {
    @Input()
    subtask: Subtask;

    constructor() { }

    ngOnInit() {
    }

}
