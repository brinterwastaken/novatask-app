import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit2,
  Ellipsis,
  Expand,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/components/todo-list";
import { Button } from "@/components/ui/button";

import "./task-card.css";
import { pb } from "@/lib/pocketbase";

export default function TaskCard(args: {
  task: Task;
  openView: () => void;
  openEdit: () => void;
  openDelete: () => void;
}) {
  // Create a date object for today at noon
  const currentDate = new Date();
  currentDate.setHours(12, 0, 0, 0);

  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 3);
  testDate.setHours(12, 0, 0, 0);

  const dueDate = args.task.due ? new Date(args.task.due) : undefined;

  return (
    <div className="bg-card flex flex-col p-2 rounded-xl border group">
      <h1>{args.task.title}</h1>
      <p
        title={args.task.description}
        className="text-muted-foreground text-xs line-clamp-2 overflow-hidden text-ellipsis"
      >
        {args.task.description}
      </p>
      {/* Duration and Due date */}
      <div className="flex items-center justify-between">
        {args.task.duration ? (
          <div className="text-xs flex items-center gap-1 text-muted-foreground">
            <Clock size="12" />
            <p> {args.task.duration} min</p>
          </div>
        ) : (
          <br />
        )}
        {dueDate ? (
          <div
            className={
              "text-xs flex items-center gap-1" +
              (currentDate >= dueDate
                ? " text-red-400"
                : testDate >= dueDate
                ? " text-yellow-400"
                : " text-blue-400")
            }
          >
            <CalendarIcon size="12" />
            <p> Due {dueDate.toLocaleDateString()}</p>
          </div>
        ) : (
          <br />
        )}
      </div>
      {/* Bottom Actions */}
      <div className="actions flex items-start justify-between gap-2 overflow-clip md:h-0 group-hover:h-9 transition-all">
        <div className="flex mt-1 gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={args.task.status == "todo"}
            className="focus-visible:ring-0"
            onClick={() => moveTask(args.task.id, args.task.status == "done" ? "doing" : "todo")}
          >
            <ChevronLeft size="24" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={args.task.status == "done"}
            className="focus-visible:ring-0"
            onClick={() => moveTask(args.task.id, args.task.status == "todo" ? "doing" : "done")}
          >
            <ChevronRight size="24" />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="dropdownbtn mt-1 focus-visible:ring-0"
            >
              <Ellipsis size="24" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={args.openView}>
              <Expand /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={args.openEdit}>
              <Edit2 /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400" onClick={args.openDelete}>
              <Trash className="text-red-400" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function moveTask(taskId: string, destination: "todo" | "doing" | "done") {
  pb.collection("tasks").update(taskId, {
    status: destination,
  });
}