import { Subtask } from './subtask';

export class Card {
	_id: string;
    title: string;
    description: string;
    columnId: string;
    boardId: string;
    order: number;
    files: [];
    tags: [];
    category: string;
    start_date: Date;
    end_date: Date;
    expecting_hours: number;
    real_hours: number;
    subtasks: Subtask[];
}