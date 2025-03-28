import { pb } from "@/lib/pocketbase";

import { LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import lightIcon from "@/assets/icon-light.png";
import darkIcon from "@/assets/icon-dark.png";

export default function NavBar(info: {
  avatarUrl: string;
  name: string;
  email: string;
}) {
  return (
    <div className="fixed top-0 left-0 w-full flex h-14 px-4 items-center justify-between bg-background/80 backdrop-blur-2xl border-b">
      <Left />
      <Right name={info.name} email={info.email} avatarUrl={info.avatarUrl} />
    </div>
  );
}

function Left() {
  return (
    <div className="flex gap-2 items-center">
      <img src={lightIcon} alt="" className="block dark:hidden w-10"/>
      <img src={darkIcon} alt="" className="hidden dark:block w-10"/>
      <div className="text-xl">Dashboard</div>
    </div>
  );
}

function Right({avatarUrl, name, email}: { avatarUrl: string; name: string; email: string }) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-black/10 dark:bg-white/10">
          <User size="20" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="text-sm leading-tight">{name}</div>
        <div className="text-xs text-muted-foreground leading-tight">
          {email}
        </div>
      </div>
      <Button
        className="ml-2"
        variant="outline"
        size="icon"
        onClick={() => pb.authStore.clear()}
      >
        <LogOut />
      </Button>
    </div>
  );
}
