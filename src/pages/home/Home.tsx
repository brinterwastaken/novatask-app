// import { useState } from "react";
import { pb } from "@/lib/pocketbase";

import NavBar from "@/components/home-navbar";
import "./home.css";
import { useEffect, useState } from "react";
import { RecordModel } from "pocketbase";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import TodoList, { CreateTaskDrawer } from "@/components/todo-list";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface UserData extends RecordModel {
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  avatar: string;
  created: string;
  updated: string;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData>();
  const [time, setTime] = useState("");
  const [quote, setQuote] = useState(["", ""]);

  useEffect(() => {
    async function fetchUserData() {
      console.log("Fetching user data");
      try {
        if (pb.authStore.record) {
          const user = await pb
            .collection("users")
            .getOne(pb.authStore.record.id);
          setUserData(user as UserData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();

    setInterval(() => {
      setTime(clock());
    }, 10000);

    setTime(clock());

    getQuote().then((quote) => {
      setQuote(quote);
    });
  }, []);

  function clock() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (
      String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0")
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col gap-2 h-dvh w-full justify-center items-center">
        <LoaderCircle size="40" className="animate-spin" />
        <div className="text-2xl">Loading</div>
        <div className="text-muted-foreground">
          This should only take a few seconds
        </div>
      </div>
    );
  } else {
    return (
      <div id="home">
        <div className="home-container overflow-auto md:mt-14 md:mx-auto w-full max-w-5xl">
          <div className="home-content bg-background/60">
            <h1 className="text-3xl">{greet(userData.name)}</h1>
            <div className="gridview">
              <GridSection
                name="Clock"
                className="md:col-span-3 row-span-2 text-6xl"
              >
                {time}
              </GridSection>
              <GridSection name="Weather" className="md:col-span-2">
                Weather
              </GridSection>
              <GridSection name="" className="md:col-span-4 py-2 px-4 flex-col">
                <div className="italic text-sm text-center">{quote[0]}</div>
                <div className="text-sm self-end mr-10"> - {quote[1]}</div>
              </GridSection>
              <GridSection
                name="Tasks"
                className="md:col-span-6 row-span-5 p-4"
              >
                <div id="todo-container" className="flex flex-col w-full">
                  <TodoList />
                  <CreateTaskDrawer toastFn={toast} />
                </div>
              </GridSection>
              <GridSection name="Schedule" className="md:col-span-3 row-span-4">
                Schedule
              </GridSection>
            </div>
          </div>
        </div>
        <div className="bg-credit fixed bottom-2 left-3 text-muted-foreground">
          Photo by{" "}
          <a
            className="underline"
            href="https://unsplash.com/@anik3t?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            Aniket Deole
          </a>{" "}
          on{" "}
          <a
            className="underline"
            href="https://unsplash.com/photos/photo-of-valley-M6XC789HLe8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          >
            Unsplash
          </a>
        </div>
        <NavBar
          name={userData.name}
          email={userData.email}
          avatarUrl={`http://127.0.0.1:8090/api/files/_pb_users_auth_/${userData.id}/${userData.avatar}`}
        />
        <Toaster position="top-center" richColors/>
      </div>
    );
  }
}

function GridSection({
  children,
  name,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
}) {
  return (
    <section
      data-slot="grid-section"
      className={cn(
        `border rounded-lg flex items-center justify-center bg-background relative`,
        className
      )}
      {...props}
    >
      <code className="absolute left-2 top-1 text-sm text-muted-foreground">
        {name}
      </code>
      {children}
    </section>
  );
}

function greet(name: string) {
  const hour = new Date().getHours();
  if (hour > 4 && hour < 12) {
    return `Good morning, ${name}! A fresh start to a great day!`;
  } else if (hour >= 12 && hour <= 16) {
    return `Good afternoon, ${name}! Keep up the energy and stay awesome!`;
  } else if (hour > 16 && hour < 20) {
    return `Good evening, ${name}! Time to unwind and relax!`;
  } else if (hour >= 20 && hour < 24) {
    return `Good night, ${name}! Wishing you sweet dreams!`;
  } else {
    return `Still up, ${name}? Hope you're having a great night!`;
  }
}

async function getQuote() {
  while (true) {
    const response = await fetch("https://quotes-api-self.vercel.app/quote");
    const data = await response.json();

    if (data.quote.length < 120) {
      return [data.quote, data.author];
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
