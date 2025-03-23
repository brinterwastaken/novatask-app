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
          <DialogDescription asChild >
            <code className="text-xs">Task ID: {data.task?.id.toUpperCase()}</code>
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
