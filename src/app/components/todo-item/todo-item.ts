import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TodoCompletedStyle } from '../../directives/todo-completed-style';
import { TodoItemType } from '../../model/todo.type';

@Component({
  selector: 'app-todo-item',
  imports: [
    TodoCompletedStyle,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    FormsModule,
  ],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  isOnEdit = signal(false);
  todo = input.required<TodoItemType>();
  todoChange = output<TodoItemType>();
  deletedTodoId = output<number>();
  editedTitle = signal<string>('');
  editedCompleted = signal<boolean>(false);

  ngOnInit() {
    this.editedTitle.set(this.todo().title);
    this.editedCompleted.set(this.todo().isCompleted);
  }

  editTodo() {
    this.isOnEdit.set(true);
  }

  cancelTodo() {
    this.isOnEdit.set(false);
  }

  markOrUnmarkTodoCompleted() {
    this.todoChange.emit({
      ...this.todo(),
      isCompleted: !this.todo().isCompleted,
    });
  }

  deleteTodo() {
    this.deletedTodoId.emit(this.todo().id);
  }

  saveTodo() {
    this.todoChange.emit({
      ...this.todo(),
      title: this.editedTitle(),
    });
    this.isOnEdit.set(false);
  }
}
