import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState(() => {
    const saved = sessionStorage.getItem("nawerni_loggedInUser");
    return saved ? "dashboard" : "login";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return sessionStorage.getItem("nawerni_loggedInUser") || "";
  });

  const handleLogout = () => {
    localStorage.removeItem("nawerni_loggedInUser");
    sessionStorage.removeItem("nawerni_loggedInUser");
    signOut(auth);
    setCurrentUser("");
    setPage("login");
  };

  // ✅ Auto-logout when user leaves the website
  useEffect(() => {
    if (page !== "dashboard") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleLogout();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [page]);

  return (
    <>
      {page === "login" && (
        <Login
          onNavigateToSignup={() => setPage("signup")}
          onLoginSuccess={(username) => {
            setCurrentUser(username || "");
            setPage("dashboard");
          }}
        />
      )}
      {page === "signup" && (
        <Signup
          onNavigateToLogin={() => setPage("login")}
          onLoginSuccess={(username) => {
            setCurrentUser(username || "");
            setPage("dashboard");
          }}
        />
      )}
      {page === "dashboard" && (
        <Dashboard
          username={currentUser}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}