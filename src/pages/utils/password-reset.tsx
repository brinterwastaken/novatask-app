import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { pb } from "@/lib/pocketbase";
import { PasswordInput } from "@/pages/loginpage/login";
import { useState } from "react";
import { toast } from "sonner";

export default function PasswordReset(args: {
  token?: string;
  email?: string;
}) {
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");

  return (
    <div className="h-dvh flex justify-center items-center p-8">
      <Card className="w-[24rem]">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          {args.token && args.email ? (
            <CardDescription>
              Reset password for your account <b>{args.email}</b>
            </CardDescription>
          ) : (
            <CardDescription>
              Invalid token or parameters supplied
            </CardDescription>
          )}
        </CardHeader>
        {args.token && args.email ? (
          <>
            <CardContent className="flex flex-col gap-4">
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
              <Button
                className="w-full"
                onClick={() =>
                  args.token && args.email
                    ? changePassword(
                        args.email,
                        args.token,
                        password,
                        confpassword
                      )
                    : toast.error("Error in changing password")
                }
              >
                Change Password and Login
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardFooter>
              <Button
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Return to App
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
      <Toaster position="top-center" richColors />
    </div>
  );
}

function changePassword(
  email: string,
  token: string,
  password: string,
  confpassword: string
) {
  if (password !== confpassword) {
    toast.error("Passwords do not match");
    return;
  }
  if (password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }
  pb.collection("users")
    .confirmPasswordReset(token, password, confpassword)
    .then(() => {
      toast.success("Password changed successfully, logging in...");

      setTimeout(() => {
        pb.collection("users")
          .authWithPassword(email, password)
          .then((res) => {
            if (!res) {
              toast.error("Error in logging in");
              return;
            }
            window.location.href = "/";
          });
      }, 1000);
    });
}
