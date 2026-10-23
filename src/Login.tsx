import React, { useState } from "react";
import { auth, db } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        // Naya user create karein
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Database mein entry
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          name: name,
          email: email,
          createdAt: new Date().toISOString()
        });
      } else {
        // Purana user login karein
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      backgroundColor: "#0f172a", 
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        background: "#1e293b", 
        padding: "36px", 
        borderRadius: "16px", 
        width: "100%", 
        maxWidth: "400px", 
        color: "#fff", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        border: "1px solid #334155"
      }}>
        <h2 style={{ textAlign: "center", margin: "0 0 10px 0", color: "#38bdf8" }}>
          PrimeAstra
        </h2>
        <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
          {isRegistering ? "Create your new account" : "Sign in to access your tools"}
        </p>

        {error && (
          <div style={{ background: "#7f1d1d", color: "#fca5a5", padding: "10px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Full Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "#fff", boxSizing: "border-box" }}
              />
            </div>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "#fff", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #475569", background: "#0f172a", color: "#fff", boxSizing: "border-box" }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: "100%", padding: "12px", background: "#0284c7", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
          >
            {loading ? "Processing..." : isRegistering ? "Register Account" : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#94a3b8" }}>
          {isRegistering ? "Already have an account? " : "Don't have an account? "}
          <span 
            onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
            style={{ color: "#38bdf8", cursor: "pointer", textDecoration: "underline" }}
          >
            {isRegistering ? "Login" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}