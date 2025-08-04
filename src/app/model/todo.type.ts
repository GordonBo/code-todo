export type TodoItemType = {
  id: number;
  isCompleted: boolean;
  title: string;
  dueDate: string;
};

export type GroupTodoItemType = {
  dueDate: string;
  items: TodoItemType[];
};
