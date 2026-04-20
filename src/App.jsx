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