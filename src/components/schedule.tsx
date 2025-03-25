import { pb } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  CalendarIcon,
  Clock,
  Loader2,
  RotateCcw,
  Sparkles,
  Trash,
} from "lucide-react";
import { ListResult } from "pocketbase";
import { Task } from "@/components/todo-list";

export default function Schedule() {
  const [schedule, setSchedule] = useState<{
    note: string;
    tasks: {
      taskId: string;
      details: string;
      title?: string;
      dueDate?: Date;
      duration?: number;
    }[];
  } | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="flex flex-col gap-2 h-full p-4 pt-8 overflow-y-auto ">
      {!schedule ? (
        <div className="m-auto flex flex-col items-center gap-2">
          <div className="text-muted-foreground">No schedule created</div>
          <Button
            onClick={() => {
              setIsCreating(true);
              getSchedule().then((resp) => {
                setSchedule(resp);
                setIsCreating(false);
              });
            }}
          >
            <Sparkles />
            Create Schedule
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-1 pb-10">
          <div className="fixed"></div>
          <h1 className="font-bold text-xl mt-4 flex items-center gap-1">
            <Sparkles size="18" className="text-indigo-400 fill-indigo-400" />
            Your Personalized Schedule
          </h1>
          <h2 className="font-medium text-lg">Suggestion</h2>
          <p className="text-sm mb-2">{schedule.note}</p>
          <h2 className="font-medium text-lg">Tasks</h2>
          {schedule.tasks.map((task) => (
            <div
              key={task.taskId}
              className="flex flex-col gap-1 py-1 border-t"
            >
              <h3 className="font-medium">{task.title}</h3>
              <div className="flex gap-2">
                {task.dueDate && (
                  <p className="text-sm text-muted-foreground flex gap-1 items-center">
                    <CalendarIcon size="14" />
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
                {task.duration ? (
                  <p className="text-sm text-muted-foreground flex gap-1 items-center">
                    <Clock size="14" />
                    {task.duration} min
                  </p>
                ) : (
                  ""
                )}
              </div>
              <p className="text-sm">{task.details}</p>
            </div>
          ))}
          <div className="text-sm text-muted-foreground py-1 border-t">
            The above schedule is AI-generated. It is only a suggestion and may
            require adjustments based on your needs.
          </div>
          <div className="flex justify-between absolute bottom-0 left-0 w-full p-2 backdrop-blur-md rounded-b-md border-t border-t-card bg-background/50">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsCreating(true);
                getSchedule().then((resp) => {
                  setSchedule(resp);
                  setIsCreating(false);
                });
              }}
            >
              <RotateCcw />
              Re-create
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setSchedule(null);
              }}
            >
              <Trash />
            </Button>
          </div>
        </div>
      )}
      <div
        className={
          "absolute left-0 top-0 h-full w-full flex flex-col gap-2 p-4 text-center items-center justify-center backdrop-blur-xl rounded-lg bg-background/75 transition-opacity" +
          (isCreating ? " opacity-100" : " opacity-0 pointer-events-none")
        }
      >
        <p>Creating a personalized schedule</p>
        <Loader2 size="36" className="animate-spin" />
      </div>
    </div>
  );
}

async function getSchedule() {
  const todotasks = (await pb.collection("tasks").getList(1, 25, {
    filter: `userid = "${pb.authStore.record?.id}" && status = "todo"`,
    sort: "-priority",
  })) as ListResult<Task>;

  const response: {
    status: string;
    aiResponse: string;
  } = await pb.send("/api/schedule", { method: "GET" });

  const aiResponse: {
    note: string;
    tasks: {
      taskId: string;
      details: string;
      title?: string;
      dueDate?: Date;
      duration?: number;
    }[];
  } = JSON.parse(response.aiResponse);

  for (const task of aiResponse.tasks) {
    const todoTask = todotasks.items.find((t) => t.id === task.taskId);
    task.title = todoTask?.title;
    task.dueDate = todoTask?.due;
    task.duration = todoTask?.duration;
  }

  return aiResponse;
}
