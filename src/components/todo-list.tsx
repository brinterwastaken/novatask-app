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
import { Minus, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";

export default function TodoList() {
  return <>Todo</>;
}

export function CreateTaskDrawer({toastFn}: {toastFn: typeof toast}) {
  const [dueDate, setDueDate] = useState<Date>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [highPriority, setHighPriority] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDueDateSelect = (date: Date | undefined) => {
    date?.setHours(12);
    setDueDate(date);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger className="absolute right-4 bottom-4" asChild>
        <Button className="rounded-3xl">
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
              onClick={() => {
                addTask(
                  title,
                  description,
                  highPriority,
                  duration,
                  dueDate
                ).then((result) => {
                  if (result?.status == "success") {
                    setDrawerOpen(false);
                    setTitle("");
                    setDescription("");
                    setDuration(0);
                    setHighPriority(false);
                    setDueDate(undefined);
                    toastFn.success("Task added successfully");
                  } else {
                    toastFn.error(result?.message);
                  }
                });
              }}
            >
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
    }).catch((err) => {
      if (err.status == 404) {
        return {
          priority: 0,
        };
      }
      else {
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
