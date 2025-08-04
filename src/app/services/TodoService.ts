import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GroupTodoItemType } from '../model/todo.type';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  url = 'https://localhost:7092/api/todo';
  http = inject(HttpClient);
  getTodoList(
    isCompleted?: boolean,
    startDueDate?: string,
    endDueDate?: string
  ) {
    const params: Record<string, string> = {};

    if (isCompleted !== undefined) {
      params['isCompleted'] = String(isCompleted);
    }
    if (startDueDate) {
      params['startDueDate'] = startDueDate;
    }
    if (endDueDate) {
      params['endDueDate'] = endDueDate;
    }

    const queryParams = new HttpParams({ fromObject: params });

    return this.http.get<{
      statusCode: string;
      isSuccess: boolean;
      errorMessage: string[];
      result: GroupTodoItemType[];
    }>(this.url, { params: queryParams });
  }

  addNewTodo(todo: { title: string; dueDate: string }) {
    return this.http.post(this.url, todo);
  }

  deleteTodo(id: number) {
    return this.http.delete(this.url + '/' + id);
  }

  updateTodo(todo: { id: number; isCompleted: boolean; title: string }) {
    return this.http.put(this.url + '/' + todo.id, todo);
  }
}
