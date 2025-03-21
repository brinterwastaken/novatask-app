import { useState } from "react";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";

import "./login.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Eye, EyeOff, Trash } from "lucide-react";
import AvatarUpload from "@/components/avatar-upload";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <>
      <div className="login-container">
        {mode === "login" ? (
          <LoginCard changeMode={() => setMode("register")} />
        ) : (
          <RegisterCard changeMode={() => setMode("login")} />
        )}
        <Toaster position="top-center" richColors />
      </div>
    </>
  );
}

function LoginCard({ changeMode }: { changeMode: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Card id="login-card">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Need to create an account?{" "}
            <span
              className="underline cursor-pointer text-foreground"
              onClick={changeMode}
            >
              Sign Up.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5 relative">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton
            type="login"
            loading={false}
            onClick={() => loginUser(email, password)}
          />
        </CardFooter>
      </Card>
    </>
  );
}

function RegisterCard({ changeMode }: { changeMode: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  return (
    <>
      <Card id="reg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Already have an account?{" "}
            <span
              className="underline cursor-pointer text-foreground"
              onClick={changeMode}
            >
              Login.
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col w-full items-center gap-1.5 justify-center">
            <AvatarUpload id="avatar" file={avatar} setFile={setAvatar} />

            {avatar ? (
              <Button
                variant="ghost"
                className="text-red-400 hover:text-red-500"
                size="sm"
                onClick={() => setAvatar(null)}
              >
                <Trash size="16" />
                Remove
              </Button>
            ) : (
              <Label htmlFor="avatar">Avatar</Label>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="name"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5 relative">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5 relative">
            <Label htmlFor="confpassword">Confirm Password</Label>
            <PasswordInput
              id="confpassword"
              value={confpassword}
              onChange={(e) => setConfPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton
            type="register"
            loading={false}
            onClick={() =>
              registerUser(name, email, password, confpassword, avatar)
            }
          />
        </CardFooter>
      </Card>
    </>
  );
}

function PasswordInput({ id, ...props }: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  return (
    <>
      <Input
        type={show ? "text" : "password"}
        id={id}
        placeholder="●●●●●●●●●"
        {...props}
      />
      <Button
        className="absolute right-0 bottom-0"
        variant="ghost"
        size="icon"
        onClick={() => setShow(!show)}
      >
        {show ? <Eye /> : <EyeOff />}
      </Button>
    </>
  );
}

function SubmitButton({
  type,
  loading,
  onClick,
}: {
  type: "login" | "register";
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <Button className="w-full" size="lg" disabled={loading} onClick={onClick}>
      {type === "login" ? "Login" : "Sign Up"}
    </Button>
  );
}

async function loginUser(email: string, password: string) {
  if (email.length < 1 || password.length < 1) {
    toast.warning("Please fill in all fields");
    return;
  }
  await pb
    .collection("users")
    .authWithPassword(email, password)
    .catch((err) => {
      toast.error(err.message);
      return;
    });
}

async function registerUser(
  name: string,
  email: string,
  password: string,
  confpassword: string,
  avatar: File | null
) {
  if (
    name.length < 1 ||
    email.length < 1 ||
    password.length < 1 ||
    confpassword.length < 1
  ) {
    toast.warning("Please fill in all fields");
    return;
  }
  if (password !== confpassword) {
    toast.error("Passwords do not match");
    return;
  }
  await pb
    .collection("users")
    .create({
      name: name,
      email: email,
      password: password,
      passwordConfirm: confpassword,
      avatar: avatar,
    })
    .catch((err) => {
      toast.error(err.message);
      return;
    });
  await pb
    .collection("users")
    .authWithPassword(email, password)
    .catch((err) => {
      toast.error(err.message);
      return;
    });
}
