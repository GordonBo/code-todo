import { formatDate } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import { catchError } from 'rxjs';
import { AddTodoItem } from '../components/add-todo-item/add-todo-item';
import { TodoItem } from '../components/todo-item/todo-item';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/messages';
import { GroupTodoItemType, TodoItemType } from '../model/todo.type';
import { TodoService } from '../services/TodoService';
@Component({
  selector: 'app-todos',
  imports: [TodoItem, TabsModule, AddTodoItem, ProgressSpinner],
  templateUrl: './todos.html',
  styleUrl: './todos.css',
})
export class Todos implements OnInit {
  todoService = inject(TodoService);
  selectedTab = signal<number>(0);
  toastService = inject(ToastrService);
  isLoading = signal(true);
  todoItems = signal<GroupTodoItemType[]>([]);
  today: string;
  yesterday: string;

  tabs: { title: string; value: number }[] = [];

  constructor() {
    const today = new Date();
    const yest = new Date(today);
    yest.setDate(today.getDate() - 1);
    this.yesterday = formatDate(yest, 'yyyy-MM-dd', 'en-US');
    this.today = formatDate(today, 'yyyy-MM-dd', 'en-US');
    this.tabs = [
      { title: 'Upcoming Todo', value: 0 },
      { title: 'Overdue Todo', value: 1 },
      { title: 'Completed Todo', value: 2 },
    ];
  }

  loadTodoList(selectedTab: number) {
    const isComplated = selectedTab === 2;
    const stardDueDate = selectedTab === 0 ? this.today : undefined;
    const endDueDate = selectedTab === 1 ? this.yesterday : undefined;
    this.isLoading.set(true);
    this.todoService
      .getTodoList(isComplated, stardDueDate, endDueDate)
      .pipe(
        catchError((err) => {
          this.isLoading.set(false);
          this.toastService.error(err?.message ?? ERROR_MESSAGES.LOAD_TODO);
          throw err;
        })
      )
      .subscribe((data) => {
        this.todoItems.set(data.result);
        this.isLoading.set(false);
      });
  }

  onTabChange(v: number | string) {
    this.selectedTab.set(Number(v));
    this.loadTodoList(Number(v));
  }

  refreshList(required: boolean) {
    if (required) {
      this.loadTodoList(this.selectedTab());
    }
  }

  ngOnInit(): void {
    this.loadTodoList(this.selectedTab());
  }

  changeTodo(updated: TodoItemType) {
    this.isLoading.set(true);
    this.todoService
      .updateTodo({
        id: updated.id,
        isCompleted: updated.isCompleted,
        title: updated.title,
      })
      .pipe(
        catchError((err) => {
          this.isLoading.set(false);
          this.toastService.error(err?.message ?? ERROR_MESSAGES.UPDATE_TODO);
          throw err;
        })
      )
      .subscribe(() => {
        this.isLoading.set(false);
        this.toastService.success(SUCCESS_MESSAGES.UPDATE_TODO);
        this.loadTodoList(this.selectedTab());
      });
  }

  deleteTodo(todoId: number) {
    this.isLoading.set(true);
    this.todoService
      .deleteTodo(todoId)
      .pipe(
        catchError((err) => {
          this.isLoading.set(false);
          this.toastService.error(err?.message ?? ERROR_MESSAGES.DELETE_TODO);
          throw err;
        })
      )
      .subscribe(() => {
        this.isLoading.set(true);
        this.toastService.success(SUCCESS_MESSAGES.DELETE_TODO);
        this.loadTodoList(this.selectedTab());
      });
  }
}
