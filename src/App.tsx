import { pb } from "@/lib/pocketbase";
import { useEffect, useState } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import Login from "@/pages/loginpage/login";
import Home from "@/pages/homepage/home";
import PasswordReset from "@/pages/utils/password-reset";
import LoadingPage from "./pages/utils/loading-page";
import BackendOffline from "./pages/utils/backend-offline";

function App() {
  const [backendStatus, setBackendStatus] = useState<
    "online" | "offline" | "unknown"
  >("unknown");
  const [isAuth, setIsAuth] = useState(false);
  const [hasUrlParams, setHasUrlParams] = useState(false);
  const [utilPage, setUtilPage] = useState<
    "passwordReset" | "verifySuccess" | null
  >(null);
  const [passwordPageParams, setPasswordPageParams] = useState<{
    token?: string;
    email?: string;
  }>({});

  useEffect(() => {
    pb.send("/api/health", {
      method: "GET",
    })
      .then((res) => {
        if (res.code === 200) {
          setBackendStatus("online");
        } else {
          setBackendStatus("offline");
        }
      })
      .catch(() => {
        setBackendStatus("offline");
      });

    const params = new URLSearchParams(window.location.search);

    if (params.size > 0) {
      setHasUrlParams(true);
      if (params.has("passwordReset")) {
        const resetPasswordToken = params.get("token");
        if (resetPasswordToken) {
          setPasswordPageParams((prev) => ({
            ...prev,
            token: resetPasswordToken,
          }));
        }
        const resetPasswordEmail = params.get("email");
        if (resetPasswordEmail) {
          setPasswordPageParams((prev) => ({
            ...prev,
            email: resetPasswordEmail,
          }));
        }

        setUtilPage("passwordReset");
      }
    } else {
      setUtilPage(null);
    }

    setIsAuth(pb.authStore.isValid);
  }, []);

  pb.authStore.onChange(() => {
    setIsAuth(pb.authStore.isValid);
  });

  return (
    <ThemeProvider>
      {backendStatus === "offline" ? (
        <BackendOffline />
      ) : backendStatus === "online" ? (
        hasUrlParams && utilPage === "passwordReset" ? (
          <PasswordReset
            token={passwordPageParams.token}
            email={passwordPageParams.email}
          />
        ) : (
          <>
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
            </div>{" "}
          </>
        )
      ) : (
        <LoadingPage />
      )}
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
