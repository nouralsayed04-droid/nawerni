import { useState, useEffect } from "react";

export default function Signup({ onNavigateToLogin, onLoginSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignup = () => {
    setError("");

    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem("nawerni_users") || "[]");

    const alreadyExists = existingUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyExists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = { name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem("nawerni_users", JSON.stringify(existingUsers));
    localStorage.setItem("nawerni_loggedInUser", email);

    if (onLoginSuccess) onLoginSuccess(email);
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, flexDirection: isMobile ? "column" : "row" }}>

        {/* LEFT PANEL */}
        <div style={{
          ...styles.left,
          minHeight: isMobile ? "auto" : "500px",
          padding: isMobile ? "28px 24px" : "36px 32px",
        }}>
          <div style={styles.logo}>
            <span style={styles.logoText}>Nawerni</span>
            <span style={styles.logoIcon}>💡</span>
          </div>
          <div style={{ ...styles.leftBody, marginTop: isMobile ? "24px" : "48px" }}>
            <h1 style={{ ...styles.leftTitle, fontSize: isMobile ? "24px" : "28px" }}>
              Join Nawerni
            </h1>
            <p style={styles.leftDesc}>
              Create your account to start tracking food and medicine expiry dates,
              reduce waste, and connect with nearby donation centers.
            </p>
          </div>
          <p style={{ ...styles.leftFooter, marginTop: isMobile ? "24px" : "0" }}>
            Track, donate, never waste
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ ...styles.right, padding: isMobile ? "32px 24px" : "50px 44px" }}>
          <h2 style={styles.title}>Sign Up</h2>
          <p style={styles.subtitle}>
            Create your account and start making a difference.
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
              autoComplete="email"
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
          </div>

          <button style={styles.btn} onClick={handleSignup}>
            CREATE ACCOUNT
          </button>

          <div style={styles.links}>
            <span style={styles.linkText}>
              Already have an account?{" "}
              <span style={styles.link} onClick={() => onNavigateToLogin && onNavigateToLogin()}>
                Log in
              </span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100%", minHeight: "100vh", backgroundColor: "#f7f7f5",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 20px", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
  },
  card: {
    display: "flex", width: "100%", maxWidth: "820px",
    borderRadius: "18px", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
  },
  left: {
    flex: 1, backgroundColor: "#4a6741", display: "flex",
    flexDirection: "column", justifyContent: "space-between", overflow: "hidden",
  },
  logo: { display: "flex", alignItems: "center", gap: "8px" },
  logoText: {
    fontSize: "24px", fontWeight: "700", color: "#e8b820",
    fontStyle: "italic", fontFamily: "'Playfair Display', serif",
  },
  logoIcon: { fontSize: "20px", lineHeight: "1" },
  leftBody: {},
  leftTitle: {
    fontWeight: "700", color: "#ffffff", lineHeight: "1.25",
    marginBottom: "16px", fontFamily: "'Playfair Display', serif",
  },
  leftDesc: {
    fontSize: "13.5px", color: "rgba(255,255,255,0.75)",
    lineHeight: "1.75", maxWidth: "260px",
  },
  leftFooter: {
    fontSize: "12px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em",
  },
  right: {
    flex: 1.25, backgroundColor: "#ffffff",
    display: "flex", flexDirection: "column", justifyContent: "center",
  },
  title: {
    fontSize: "32px", fontWeight: "700", color: "#3a5535",
    marginBottom: "6px", fontFamily: "'Playfair Display', serif",
  },
  subtitle: { fontSize: "13.5px", color: "#888", marginBottom: "24px", lineHeight: "1.6" },
  errorBox: {
    width: "100%", backgroundColor: "#fdecea", color: "#c0392b",
    borderRadius: "10px", padding: "13px 16px", fontSize: "14px",
    textAlign: "center", marginBottom: "18px",
  },
  field: { marginBottom: "18px" },
  label: { display: "block", fontSize: "13px", fontWeight: "500", color: "#444", marginBottom: "7px" },
  input: {
    width: "100%", padding: "12px 16px", border: "1.5px solid #d0d0cc",
    borderRadius: "10px", fontSize: "14px", color: "#1e2d1a", outline: "none",
    fontFamily: "'DM Sans', sans-serif", backgroundColor: "#fff", boxSizing: "border-box",
  },
  btn: {
    width: "100%", padding: "14px", backgroundColor: "#4a6741", color: "#ffffff",
    border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700",
    letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", marginTop: "4px",
  },
  links: {
    display: "flex", justifyContent: "center", alignItems: "center",
    marginTop: "20px", fontSize: "13px",
  },
  linkText: { color: "#888" },
  link: { color: "#4a6741", fontWeight: "600", cursor: "pointer", textDecoration: "underline" },
};