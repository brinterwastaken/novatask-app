import { LoaderCircle } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex flex-col gap-2 h-dvh w-full justify-center items-center backdrop-blur-xl backdrop-brightness-50 text-gray-50">
      <LoaderCircle size="40" className="animate-spin" />
      <div className="text-2xl">Loading</div>
      <div className="text-gray-400">This should only take a few seconds</div>
    </div>
  );
}
