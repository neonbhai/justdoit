import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Mic, Square, Calendar, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TaskItem } from "@/components/task-item";
import { TaskFilters } from "@/components/task-filters";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAudioRecorder } from "@/lib/audio-recorder";
import type { Task, TaskCategory } from "@/lib/types";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    TaskCategory | "all"
  >("all");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Team Meeting",
      description: "Discuss project milestones",
      time: "2:00 PM",
      completed: false,
      createdAt: new Date(),
      category: "work",
    },
    {
      id: "2",
      title: "Review Documentation",
      description: "Update API documentation",
      time: "4:30 PM",
      completed: false,
      createdAt: new Date(),
      category: "work",
    },
    {
      id: "3",
      title: "Gym Session",
      description: "Cardio and strength training",
      time: "6:00 PM",
      completed: false,
      createdAt: new Date(),
      category: "health",
    },
  ]);

  const { toast } = useToast();
  const { startRecording, stopRecording } = useAudioRecorder();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRecording = async () => {
    try {
      if (!isRecording) {
        await startRecording();
        setIsRecording(true);
        toast({
          title: "Recording started",
          description: "Speak clearly into your microphone",
        });
      } else {
        setIsProcessing(true);
        const audioBlob = await stopRecording();
        setIsRecording(false);

        // Here you would send the audioBlob to your AI service
        // For now, we'll simulate a response
        setTimeout(() => {
          const newTask: Task = {
            id: Date.now().toString(),
            title: "New meeting with the design team",
            description: "Discuss the latest UI updates",
            time: "3:00 PM",
            completed: false,
            createdAt: new Date(),
            category: "work",
          };

          setTasks((prev) => [...prev, newTask]);
          setTranscribedText(
            "I've scheduled a meeting with the design team at 3 PM to discuss the latest UI updates."
          );
          setIsProcessing(false);

          toast({
            title: "Task created",
            description: "New task has been added to your schedule",
          });
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your schedule",
    });
  };

  const filteredTasks = tasks.filter((task) =>
    selectedCategory === "all" ? true : task.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header Section */}
      <header className="max-w-4xl mx-auto space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Hey Abhas 👋</h1>
          <ThemeToggle />
        </div>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {format(currentTime, "EEEE, MMMM d, yyyy")}
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {format(currentTime, "h:mm a")}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-6">
        {/* Tasks Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Today's Tasks</h2>
              <p className="text-sm text-muted-foreground">
                {filteredTasks.length} task
                {filteredTasks.length !== 1 ? "s" : ""}
              </p>
            </div>

            <TaskFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {filteredTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No tasks found for this category
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Voice Assistant</h2>
              <Button
                onClick={handleRecording}
                variant={isRecording ? "destructive" : "default"}
                size="icon"
                className="rounded-full h-12 w-12"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : isRecording ? (
                  <Square className="h-6 w-6 " />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </div>

            <Separator />

            <div className="min-h-[100px] p-4 bg-muted rounded-lg">
              {transcribedText ? (
                <p className="text-foreground">{transcribedText}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  {isRecording
                    ? "Listening..."
                    : isProcessing
                    ? "Processing your request..."
                    : "Click the microphone button and start speaking to create new tasks"}
                </p>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default App;
