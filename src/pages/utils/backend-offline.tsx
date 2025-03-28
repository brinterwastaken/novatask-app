import lightIcon from "@/assets/icon-light.png";
import darkIcon from "@/assets/icon-dark.png";
import {
  CloudAlert,
  Globe,
  Laptop,
  MoveHorizontal,
  Server,
} from "lucide-react";

export default function BackendOffline() {
  return (
    <div className="flex h-dvh w-full justify-center items-center">
      <div className="flex flex-col w-full sm:w-min p-10 gap-4 justify-between backdrop-blur-xl bg-background/60 border rounded-4xl">
        <div className="text-red-400 flex gap-2 items-center">
          <CloudAlert size={36} className="shrink-0" />
          <div className="text-2xl md:text-3xl">Error 503: Service Unavailable</div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <div className="w-48 h-36 hidden sm:flex rounded-md bg-background flex-col justify-center items-center">
            <Laptop size={42} className="opacity-40 mb-2" />
            <div>Your Browser</div>
            <p className="text-green-400">Working</p>
          </div>
          <MoveHorizontal size={28} className="hidden sm:block" />
          <div className="w-48 h-36 hidden sm:flex rounded-md bg-background flex-col justify-center items-center">
            <Globe size={42} className="opacity-40 mb-2" />
            <div>Novatask Frontend</div>
            <p className="text-green-400">Working</p>
          </div>
          <MoveHorizontal size={28} className="text-red-400 hidden sm:block" />
          <div className="w-48 h-36 rounded-md bg-background flex flex-col justify-center items-center">
            <Server size={42} className="opacity-40 mb-2" />
            <div>Novatask Backend</div>
            <p className="text-red-400">Error</p>
          </div>
        </div>
        <div className="sm:text-justify">
          The backend server may be offline or experiencing technical issues,
          preventing requests from being processed. Please contact the{" "}
          <a href="https://github.com/brinterwastaken" className="underline hover:text-blue-400">
            developer
          </a>{" "}
          for more information or try again later.
        </div>
        <div className="flex gap-1 items-center text-xl self-end opacity-90">
          <img src={lightIcon} alt="" className="block dark:hidden w-12" />
          <img src={darkIcon} alt="" className="hidden dark:block w-12" />
          Novatask
        </div>
      </div>
    </div>
  );
}
