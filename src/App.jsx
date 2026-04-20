import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

const savedUser = localStorage.getItem("nawerni_loggedInUser") ||
                  sessionStorage.getItem("nawerni_loggedInUser") || "";

export default function App() {
  const [page, setPage] = useState(savedUser ? "dashboard" : "login");
  const [currentUser, setCurrentUser] = useState(savedUser);

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
        <Signup onNavigateToLogin={() => setPage("login")} />
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