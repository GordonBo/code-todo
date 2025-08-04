import { formatDate } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { catchError } from 'rxjs';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/messages';
import { TodoService } from '../../services/TodoService';
import { PageLoading } from '../page-loading/page-loading';

@Component({
  selector: 'app-add-todo-item',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    DatePickerModule,
    PageLoading,
    DataViewModule,
  ],
  templateUrl: './add-todo-item.html',
  styleUrl: './add-todo-item.css',
})
export class AddTodoItem {
  refreshList = output<boolean>();
  newTodoTitle = '';
  newDueDate = '';
  minDate: Date = new Date();
  todoService = inject(TodoService);
  toastService = inject(ToastrService);
  isProcessing = signal(false);
  submitClicked = signal(false);
  hasApiError = signal(false);

  addNewTodoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addNewTodoForm = this.fb.nonNullable.group({
      newTodoTitle: ['', Validators.required],
      newDueDate: ['', Validators.required],
    });
  }

  get isNewTodoTitleInvalid(): boolean {
    const control = this.addNewTodoForm.get('newTodoTitle');

    return (this.submitClicked() && control?.invalid) || false;
  }

  get isDueDateInvalid(): boolean {
    const control = this.addNewTodoForm.get('newDueDate');
    return (this.submitClicked() && control?.invalid) || false;
  }

  reset() {
    this.addNewTodoForm.reset();
    this.submitClicked.set(false);
  }

  onAddNewTodo() {
    this.submitClicked.set(true);
    if (this.addNewTodoForm.invalid) {
      this.addNewTodoForm.markAllAsTouched();
      return;
    }
    this.isProcessing.set(true);
    this.todoService
      .addNewTodo({
        title: this.addNewTodoForm.get('newTodoTitle')?.value,
        dueDate: formatDate(
          this.addNewTodoForm.get('newDueDate')?.value,
          'yyyy-MM-dd',
          'en-US'
        ),
      })
      .pipe(
        catchError((err) => {
          this.isProcessing.set(false);
          this.toastService.error(err?.message ?? ERROR_MESSAGES.ADD_TODO);
          throw err;
        })
      )
      .subscribe(() => {
        this.reset();
        this.toastService.success(SUCCESS_MESSAGES.ADD_TODO);
        this.refreshList.emit(true);
        this.isProcessing.set(false);
      });
  }
}
