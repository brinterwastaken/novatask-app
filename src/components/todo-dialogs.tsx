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
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pb } from "@/lib/pocketbase";
import { Input } from "./ui/input";
import { useState } from "react";

export function ViewEditDialog({
  data,
  setData,
}: {
  data: { open: boolean; task?: Task; mode: "view" | "edit" };
  setData: React.Dispatch<
    React.SetStateAction<{ open: boolean; task?: Task; mode: "view" | "edit" }>
  >;
}) {
  const [newTaskData, setNewTaskData] = useState<{
    title?: string;
    description?: string;
    duration?: number;
    priority?: number;
    dueDate?: Date;
  }>({
    title: data.task?.title,
    description: data.task?.description,
    duration: data.task?.duration,
    dueDate: data.task?.due,
  });

  return (
    <Dialog
      open={data.open}
      onOpenChange={(open) =>
        setData({ open: open, task: data.task, mode: data.mode })
      }
    >
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>
            {data.mode.charAt(0).toUpperCase() + data.mode.slice(1)} task
          </DialogTitle>
          <DialogDescription className="text-xs">
            {data.mode == "view"
              ? "View the task in detail"
              : "Edit the task details"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="text-xs text-muted-foreground">Title</div>
          {data.mode == "edit" ? (
            <Input
              className="!text-xl"
              placeholder={data.task?.title}
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ title: e.target.value })}
            />
          ) : (
            <h1 className="text-xl">{data.task?.title}</h1>
          )}
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Description</div>
          {data.mode == "edit" ? (
            <Input
              className="!text-sm"
              placeholder={data.task?.description}
              value={newTaskData.description}
              onChange={(e) => setNewTaskData({ description: e.target.value })}
            />
          ) : (
            <p className="text-sm">{data.task?.description}</p>
          )}
        </div>
        {/* Duration and Due Date */}
        {data.mode == "view" ? (
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
        ) : (
          ""
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setData({
                open: data.open,
                task: data.task,
                mode: data.mode == "view" ? "edit" : "view",
              })
            }
          >
            {data.mode == "view" ? "Edit" : "View"} mode
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
          {data.mode == "edit" ? (
            <DialogClose asChild>
              <Button type="button">Save</Button>
            </DialogClose>
          ) : (
            ""
          )}
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
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the task "{data.task?.title}"
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
