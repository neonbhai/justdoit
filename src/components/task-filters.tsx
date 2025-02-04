import { Button } from "@/components/ui/button";
import { TaskCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Briefcase, User, ShoppingCart, Heart, MoreHorizontal } from "lucide-react";

interface TaskFiltersProps {
  selectedCategory: TaskCategory | 'all';
  onSelectCategory: (category: TaskCategory | 'all') => void;
}

const categories: { id: TaskCategory | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Tasks', icon: <MoreHorizontal className="w-4 h-4" /> },
  { id: 'work', label: 'Work', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
  { id: 'shopping', label: 'Shopping', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> },
];

export function TaskFilters({ selectedCategory, onSelectCategory }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={cn(
            "flex items-center gap-2",
            selectedCategory === category.id && "bg-primary text-primary-foreground"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.icon}
          {category.label}
        </Button>
      ))}
    </div>
  );
}