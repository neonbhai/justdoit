export type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  time?: string;
  completed: boolean;
  createdAt: Date;
  category: TaskCategory;
}

export interface TaskGroup {
  title: string;
  tasks: Task[];
}