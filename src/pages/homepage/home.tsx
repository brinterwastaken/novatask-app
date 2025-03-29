// import { useState } from "react";
import { pb } from "@/lib/pocketbase";

import NavBar from "@/components/home-navbar";
import "./home.css";
import { useEffect, useState } from "react";
import { RecordModel } from "pocketbase";
import { cn } from "@/lib/utils";
import Todo, { CreateTaskDrawer } from "@/components/todo-list";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Schedule from "@/components/schedule";
import LoadingPage from "@/pages/utils/loading-page";
import { FlaskConical } from "lucide-react";
import VerificationCard from "@/components/verification-card";

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
    return <LoadingPage />;
  } else {
    if (!userData.verified) {
      return (
        <div className="flex justify-center items-center h-screen">
          <VerificationCard />
        </div>
      )
    } else {
      return (
        <div id="home">
          <div className="home-container my-auto md:mx-auto w-full max-w-6xl">
            <div className="home-content bg-background/60 mt-14">
              <h1 className="text-3xl">{greet(userData.name)}</h1>
              <div className="md:hidden">
                Mobile UI for Novatask is a work in progress.
              </div>
              <div className="gridview">
                <GridSection
                  name="Clock"
                  className="md:col-span-3 row-span-2 min-h-24 text-6xl flex justify-center items-center"
                >
                  {time}
                </GridSection>
                <GridSection
                  name="Weather"
                  className="md:col-span-2 min-h-24 flex justify-center items-center text-muted-foreground"
                >
                  <FlaskConical size="24" /> WIP
                </GridSection>
                <GridSection
                  name=""
                  className="md:col-span-4 min-h-24 py-2 px-4 flex flex-col items-center justify-center"
                >
                  <div className="italic text-sm text-center">{quote[0]}</div>
                  <div className="text-sm self-end mr-[5%]"> - {quote[1]}</div>
                </GridSection>
                <GridSection
                  name="Tasks"
                  className="col-span-6 row-span-5 p-4 pt-10 flex flex-col md:flex-row gap-2 w-full md:h-full"
                >
                  <Todo />
                </GridSection>
                <GridSection
                  name="Schedule"
                  className="md:col-span-3 row-span-4 min-h-80"
                  showBorder={true}
                >
                  <Schedule />
                </GridSection>
              </div>
            </div>
          </div>
          <CreateTaskDrawer toastFn={toast} />
          <NavBar
            name={userData.name}
            email={userData.email}
            avatarUrl={`${pb.baseURL}/api/files/_pb_users_auth_/${userData.id}/${userData.avatar}`}
          />
          <Toaster position="top-right" offset={{ top: "5rem" }} richColors />
        </div>
      );
    }
  }
}

function GridSection({
  children,
  name,
  showBorder = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  showBorder?: boolean;
}) {
  return (
    <section
      data-slot="grid-section"
      className={cn(`border rounded-lg bg-background relative`, className)}
      {...props}
    >
      {name && (
        <code
          className={
            "absolute left-2 top-2 text-sm text-muted-foreground px-2 py-1" +
            (showBorder ? " backdrop-blur-md rounded-sm border" : "")
          }
        >
          {name}
        </code>
      )}
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
