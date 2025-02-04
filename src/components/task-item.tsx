import { Check, Clock, Trash2 } from 'lucide-react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  return (
    <div className={cn(
      "p-4 bg-muted rounded-lg flex items-start justify-between gap-4 group animate-in",
      task.completed && "opacity-60"
    )}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {task.time && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-3 h-3 mr-1" />
              {task.time}
            </div>
          )}
        </div>
        <h3 className={cn(
          "font-medium mt-1",
          task.completed && "line-through"
        )}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onComplete(task.id)}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}