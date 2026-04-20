import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem("nawerni_loggedInUser") ||
                  sessionStorage.getItem("nawerni_loggedInUser");
    return saved ? "dashboard" : "login";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("nawerni_loggedInUser") ||
           sessionStorage.getItem("nawerni_loggedInUser") || "";
  });

  const handleLogout = () => {
    localStorage.removeItem("nawerni_loggedInUser");
    sessionStorage.removeItem("nawerni_loggedInUser");
    signOut(auth);
    setCurrentUser("");
    setPage("login");
  };

  // ✅ Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (page !== "dashboard") return;

    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleLogout();
      }, 5 * 60 * 1000); // 5 minutes
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
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