import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import Login from "./pages/login/Login";
import Home from "@/pages/home/Home";

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(pb.authStore.isValid);
  }, []);

  pb.authStore.onChange(() => {
    setIsAuth(pb.authStore.isValid);
  });

  return (
    <ThemeProvider>
      <AuthCheck isAuth={isAuth} />
      <div className="bg-credit text-xs fixed bottom-2 left-3 text-muted-foreground">
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
    </ThemeProvider>
  );
}

function AuthCheck({ isAuth }: { isAuth: boolean }) {
  if (isAuth) {
    return <Home />;
  } else {
    return <Login />;
  }
}

export default App;
