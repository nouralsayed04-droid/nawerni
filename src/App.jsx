import { useState } from "react";
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
          onLogout={() => {
            localStorage.removeItem("nawerni_loggedInUser");
            sessionStorage.removeItem("nawerni_loggedInUser");
            setCurrentUser("");
            setPage("login");
          }}
        />
      )}
    </>
  );
}