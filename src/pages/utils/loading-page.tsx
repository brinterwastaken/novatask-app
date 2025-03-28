import { Hatch } from "ldrs/react";
import "ldrs/react/Hatch.css";

import lightIcon from "@/assets/icon-light.png";
import darkIcon from "@/assets/icon-dark.png";

export default function LoadingPage() {
  return (
    <div className="flex h-dvh w-full items-end dark:bg-neutral-900/40">
      <div className="flex w-full px-24 py-12 justify-between backdrop-blur-xl border-t bg-background/50 dark:bg-transparent">
        <div className="flex text-4xl items-center gap-2 ">
          <img src={lightIcon} alt="" className="block dark:hidden w-20" />
          <img src={darkIcon} alt="" className="hidden dark:block w-20" />
          Novatask
        </div>
        <div className="flex gap-6 items-center">
          <Hatch size="40" stroke="4" speed="3" color="currentColor" />
          <div className="flex flex-col">
            <div className="text-2xl">Loading</div>
            <div className="text-foreground/80">
              This should only take a few seconds
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
