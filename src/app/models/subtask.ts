export class Subtask {
	_id: string;
    title: string;
    description: string;
    columnId: string;
    boardId: string;
    cardId: string;
    order: number;
    start_date: Date;
    end_date: Date;
    expecting_hours: number;
    real_hours: number;
}