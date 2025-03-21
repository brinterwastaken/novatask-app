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
