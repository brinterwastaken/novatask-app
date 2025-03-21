import { Upload, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChangeEvent } from "react";

export default function AvatarUpload({
  id,
  file,
  setFile,
}: {
  id: string;
  file: File | null;
  setFile: (file: File | null) => void;
}) {
  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      setFile(target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <Avatar className="w-24 h-24 relative group">
      <AvatarImage src={file ? URL.createObjectURL(file) : ""} />
      <AvatarFallback className="bg-black/10 dark:bg-white/10">
        <User size="48" />
      </AvatarFallback>
      <div className="absolute w-full h-full flex flex-col items-center justify-center backdrop-blur-lg backdrop-brightness-125 dark:backdrop-brightness-75 opacity-0 group-hover:opacity-100 transition-opacity">
        <Upload size="24" />
        <p>Upload</p>
      </div>
      <input
        type="file"
        id={id}
        accept="image/png, image/jpeg, image/svg+xml, image/webp"
        className="absolute h-full w-full opacity-0"
        onChange={handleChange}
      />
    </Avatar>
  );
}
