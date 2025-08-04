import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appTodoCompletedStyle]',
  standalone: true,
})
export class TodoCompletedStyle {
  isCompleted = input(false);

  ele = inject(ElementRef);
  styleEffect = effect(() => {
    if (this.isCompleted()) {
      this.ele.nativeElement.style.textDecoration = 'line-through';
    } else {
      this.ele.nativeElement.style.textDecoration = 'none';
    }
  });
}
