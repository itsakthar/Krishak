"use client";

import { FormEvent, useState } from "react";

import { PublicOnly } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const { login, register } = useKrishak();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      if (mode === "register") {
        await register({ name, mobile, password });
      } else {
        await login({ mobile, password });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PublicOnly>
      <div className="auth-shell">
        <section className="auth-card">
          <div className="brand-chip">Krishak</div>
          <h1>Nature-friendly tools for farmers</h1>
          <p>
            Buy, sell, hire labour, and connect quickly with a simple mobile-first experience.
          </p>

          <div className="segmented-control">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
              type="button"
            >
              Register
            </button>
          </div>

          <form className="form-stack" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <label className="field">
                <span>Name</span>
                <input onChange={(event) => setName(event.target.value)} placeholder="Your full name" value={name} />
              </label>
            ) : null}

            <label className="field">
              <span>Mobile Number</span>
              <input
                inputMode="numeric"
                onChange={(event) => setMobile(event.target.value)}
                placeholder="10-digit mobile number"
                value={mobile}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                onChange={(event) => setPassword(event.target.value)}
                placeholder="4 digits or more"
                type="password"
                value={password}
              />
            </label>

            <button className="primary-button tall" disabled={submitting} type="submit">
              {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>

          {message ? <p className="inline-message error">{message}</p> : null}

          <div className="info-box">
            <strong>Farmer app access</strong>
            <p>Register a new mobile number to enter the Krishak user app and start using the marketplace.</p>
          </div>
        </section>
      </div>
    </PublicOnly>
  );
}
