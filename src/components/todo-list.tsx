import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Loader2, Minus, Plus, RefreshCw, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";
import { RecordModel } from "pocketbase";
import TaskCard from "@/components/task-card";
import { DeleteDialog, ViewEditDialog } from "./todo-dialogs";

export interface Task extends RecordModel {
  id: string;
  title: string;
  description: string;
  status: string;
  duration: number;
  priority: number;
  due: Date;
}

export default function Todo() {
  const [tasks, setTasks] = useState<{
    todo: Task[];
    doing: Task[];
    done: Task[];
  }>({
    todo: [],
    doing: [],
    done: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const getTasks = async () => {
    setIsLoading(true);
    const tasks = await getTaskList();
    setTasks(tasks);
    setIsLoading(false);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <div className="refreshbtn absolute top-2 right-2">
        <Button
          size="sm"
          variant="link"
          className="text-muted-foreground"
          onClick={getTasks}
        >
          <RefreshCw className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>
      <TaskList title="Todo" tasks={tasks.todo} />
      <TaskList title="Doing" tasks={tasks.doing} />
      <TaskList title="Done" tasks={tasks.done} />
    </>
  );
}

function TaskList(args: { title: string; tasks: Task[] }) {
  const [viewEditDialog, setViewEditDialog] = useState<{ open: boolean; task?: Task, mode: "view" | "edit" }>({
    open: false,
    mode: "view",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    task?: Task;
  }>({
    open: false,
  });

  return (
    <div className="flex flex-col w-full border p-2 rounded-xs">
      <h1 className="text-center pb-1 border-b">{args.title}</h1>
      <div className="flex flex-col gap-2 pt-2 overflow-y-auto">
        {args.tasks.map((task) => {
          return (
            <TaskCard
              key={task.id}
              task={task}
              openView={() => setViewEditDialog({ open: true, task: task, mode: "view" })}
              openEdit={() => setViewEditDialog({ open: true, task: task, mode: "edit" })}
              openDelete={() => setDeleteDialog({ open: true, task: task })}
            />
          );
        })}
        {args.title == "Todo" ? (
          <div className="absolute left-0 bottom-0 h-12 w-full"></div>
        ) : (
          ""
        )}
      </div>

      {/* Dialogs */}
      <ViewEditDialog data={viewEditDialog} setData={setViewEditDialog} />
      <DeleteDialog data={deleteDialog} setData={setDeleteDialog} />
    </div>
  );
}

export function CreateTaskDrawer({ toastFn }: { toastFn: typeof toast }) {
  const [dueDate, setDueDate] = useState<Date>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [highPriority, setHighPriority] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add this state for loading spinner

  const handleDueDateSelect = (date: Date | undefined) => {
    date?.setHours(12);
    setDueDate(date);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger className="fixed right-6 bottom-6 w-max" asChild>
        <Button className="rounded-3xl" size="lg">
          <Plus /> Add a task
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl overflow-y-auto">
          <DrawerHeader className="relative">
            <DrawerTitle className="text-2xl">Add a task</DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Add a task to your todo list
            </DrawerDescription>
            <DrawerClose className="absolute right-4" asChild>
              <Button size="icon" variant="ghost">
                <X className="!w-6 !h-6" size={36} />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 flex flex-col md:flex-row w-full gap-4">
            <div className="flex flex-col w-full gap-1.5">
              <Label htmlFor="tasktitle">Title</Label>
              <Input
                placeholder="Buy Groceries"
                id="tasktitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <br />
              <Label htmlFor="taskdesc">Description</Label>
              <Input
                placeholder="Get bread, tomatoes, carrots, flour"
                id="taskdesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="text-xs text-muted-foreground">
                Optional: Enter a description of your task
              </div>
              <br />
              <Label htmlFor="duration">Duration</Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="45"
                  id="duration"
                  value={duration != 0 ? duration : ""}
                  onChange={(e) =>
                    handleDurationChange(e.target.value, setDuration)
                  }
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
              <div className="text-xs text-muted-foreground">
                Optional: Enter the estimated duration of your task
              </div>
              <br />
              <Label htmlFor="highpriority">
                <Checkbox
                  id="highpriority"
                  checked={highPriority}
                  onClick={() => setHighPriority(!highPriority)}
                />{" "}
                Highest Priority
              </Label>
              <div className="text-xs text-muted-foreground">
                Optional: Set this task to have the highest priority in the list
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="duedate">Due Date</Label>
              <Calendar
                id="duedate"
                mode="single"
                selected={dueDate}
                onSelect={handleDueDateSelect}
                className="mx-auto rounded-md border w-max"
              />
              <div className="text-xs text-muted-foreground">
                Optional: Set a due date for your task
              </div>
            </div>
          </div>
          <DrawerFooter className="mb-4">
            <Button
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                addTask(
                  title,
                  description,
                  highPriority,
                  duration,
                  dueDate
                ).then((result) => {
                  if (result?.status == "success") {
                    setDrawerOpen(false);
                    setIsLoading(false);
                    setTitle("");
                    setDescription("");
                    setDuration(0);
                    setHighPriority(false);
                    setDueDate(undefined);
                    toastFn.success("Task added successfully");
                  } else {
                    toastFn.error(result?.message);
                    setIsLoading(false);
                  }
                });
              }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : ""}
              Submit
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function handleDurationChange(
  value: string,
  setDuration: (duration: number) => void
) {
  const duration = parseInt(value);
  if (isNaN(duration)) {
    setDuration(0);
  } else {
    setDuration(duration);
  }
}

async function getTaskList() {
  const todotasks = await pb.collection("tasks").getList(1, 25, {
    filter: `userid = "${pb.authStore.record?.id}" && status = "todo"`,
    sort: "-priority",
  });
  const doingtasks = await pb.collection("tasks").getList(1, 25, {
    filter: `userid = "${pb.authStore.record?.id}" && status = "doing"`,
    sort: "-priority",
  });
  const donetasks = await pb.collection("tasks").getList(1, 25, {
    filter: `userid = "${pb.authStore.record?.id}" && status = "done"`,
    sort: "-priority",
  });
  return {
    todo: todotasks.items as Task[],
    doing: doingtasks.items as Task[],
    done: donetasks.items as Task[],
  };
}

async function addTask(
  title: string,
  description: string,
  highPriority: boolean,
  duration: number,
  dueDate?: Date
) {
  if (title == undefined || title == "") {
    return {
      status: "error",
      message: "Please enter a title for your task",
    };
  }

  const highestPriority = await pb
    .collection("tasks")
    .getFirstListItem(`userid = "${pb.authStore.record?.id}"`, {
      sort: "-priority",
    })
    .catch((err) => {
      if (err.status == 404) {
        return {
          priority: 0,
        };
      } else {
        console.error(err);
        return;
      }
    });

  const data = {
    userid: pb.authStore.record?.id,
    title: title,
    description: description,
    status: "todo",
    duration: duration,
    priority: highPriority ? highestPriority?.priority + 1 : 0,
    due: dueDate,
  };

  const record = await pb.collection("tasks").create(data);

  if (record) {
    return {
      status: "success",
    };
  }
}
