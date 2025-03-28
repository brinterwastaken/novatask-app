import { Task } from "@/components/todo-list";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pb } from "@/lib/pocketbase";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { useEffect, useState } from "react";
import { forceNumberInput } from "@/lib/utils";
import { toast } from "sonner";

export function ViewDialog({
  data,
  setData,
}: {
  data: { open: boolean; task?: Task };
  setData: React.Dispatch<React.SetStateAction<{ open: boolean; task?: Task }>>;
}) {
  return (
    <Dialog
      open={data.open}
      onOpenChange={(open) => setData({ open: open, task: data.task })}
    >
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>View Task</DialogTitle>
          <DialogDescription asChild>
            <code className="text-xs">
              Task ID: {data.task?.id.toUpperCase()}
            </code>
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="text-xs text-muted-foreground">Title</div>

          <h1 className="text-xl">{data.task?.title}</h1>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Description</div>

          <p className="text-sm">{data.task?.description}</p>
        </div>
        {/* Duration and Due Date */}
        <div className="flex items-center justify-between">
          {data.task?.duration ? (
            <div className="text-sm flex items-center gap-1 text-muted-foreground">
              <Clock size="14" />
              <p> {data.task.duration} min</p>
            </div>
          ) : (
            <br />
          )}
          {data.task?.due ? (
            <div className="text-sm flex items-center gap-1 text-muted-foreground">
              <CalendarIcon size="14" />
              <p>Due {new Date(data.task.due).toLocaleDateString()}</p>
            </div>
          ) : (
            <br />
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog({
  data,
  setData: setDeleteDialog,
}: {
  data: { open: boolean; task?: Task };
  setData: React.Dispatch<React.SetStateAction<{ open: boolean; task?: Task }>>;
}) {
  return (
    <Dialog
      open={data.open}
      onOpenChange={(open) => setDeleteDialog({ open: open, task: data.task })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the task "{data.task?.title}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              onClick={() => deleteTask(data.task?.id)}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function deleteTask(taskId?: string) {
  if (taskId) {
    pb.collection("tasks").delete(taskId);
  }
}

export function EditDialog({
  open,
  task,
  setOpen,
}: {
  open: boolean;
  task?: Task;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [dueDate, setDueDate] = useState<Date>();
  const [duration, setDuration] = useState<number>(0);
  const [priority, setPriority] = useState<number>(0);

  const handleDueDateSelect = (date: Date | undefined) => {
    date?.setHours(12);
    setDueDate(date);
  };

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(new Date(task.due));
      setDuration(task.duration);
      setPriority(task.priority);
    }
  }, [task]);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="sm:max-w-full w-[44rem]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            <code className="text-xs">Task ID: {task?.id.toUpperCase()}</code>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              type="text"
              id="edit-title"
              placeholder={task?.title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <br />
            <Label htmlFor="edit-desc">Description</Label>
            <Input
              type="text"
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description"
            />
            <br />
            <Label htmlFor="edit-duration">Duration</Label>
            <div className="flex items-center gap-2 relative">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Set estimated duration"
                id="edit-duration"
                value={duration != 0 ? duration : ""}
                onChange={(e) => forceNumberInput(e.target.value, setDuration)}
              />
              <div className="text-sm absolute right-26">Minutes</div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setDuration(() => duration + 5)}
              >
                <Plus />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  duration < 5
                    ? setDuration(0)
                    : setDuration(() => duration - 5)
                }
              >
                <Minus />
              </Button>
            </div>
            <br />
            <Label htmlFor="edit-priority">Priority</Label>
            <div className="flex items-center gap-2 relative">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Set new priority"
                id="edit-priority"
                value={priority}
                onChange={(e) => forceNumberInput(e.target.value, setPriority)}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => setPriority(() => priority + 1)}
              >
                <Plus />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  priority < 1
                    ? setPriority(0)
                    : setPriority(() => priority - 1)
                }
              >
                <Minus />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Higher the priority, higher will the task be shown in the list.
              Zero for no specific priority. This will replace any task that
              previously had this priority.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-date">Due Date</Label>
            <Calendar
              id="edit-date"
              mode="single"
              className="mx-auto rounded-md border w-max"
              selected={dueDate}
              onSelect={handleDueDateSelect}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() =>
                editTask(
                  duration,
                  priority,
                  task?.priority || 0,
                  title,
                  description,
                  dueDate,
                  task?.id
                )
              }
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function editTask(
  duration: number,
  priority: number,
  oldPriority: number,
  title?: string,
  description?: string,
  dueDate?: Date,
  taskId?: string
) {
  if (!taskId) {
    toast.error("Invalid task, task not edited.");
    return;
  }
  if (!title || title?.length < 1) {
    toast.error("Title cannot be empty, task not edited.");
    return;
  }
  const otherTaskWithPriority =
    priority != 0
      ? await pb
          .collection("tasks")
          .getFirstListItem(
            `userid = '${pb.authStore.record?.id}' && priority = ${priority}`
          ).catch(() => null)
      : null;
  if (otherTaskWithPriority) {
    await pb.collection("tasks").update(otherTaskWithPriority.id, {
      priority: 0,
    });
  }
  const response = await pb.collection("tasks").update(taskId, {
    title: title,
    description: description,
    due: dueDate || null,
    duration: duration,
    priority: priority,
  });
  if (response.id) {
    toast.success("Task edited successfully.");
  }
  if (otherTaskWithPriority) {
    await pb.collection("tasks").update(otherTaskWithPriority.id, {
      priority: oldPriority,
    });
  }
}
