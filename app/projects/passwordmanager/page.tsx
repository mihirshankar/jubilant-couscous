"use client";

import React, { useEffect, useState } from "react";
import "./passwordmanager.css";

type Account = {
  name: string;
  url: string;
  username: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_PASSWORD_MANAGER_API ?? "https://password-website-z9vh.onrender.com/";

export default function PasswordManagerPage() {
  const [mode, setMode] = useState<"new" | "returning">("returning");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [masterPassword, setMasterPassword] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [accountName, setAccountName] = useState("");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [revealedPasswords, setRevealedPasswords] = useState<
    Record<string, string>
  >({});

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleApiResponse(response: Response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.detail || data?.message || "Something went wrong.";
      throw new Error(errorMessage);
    }

    return data;
  }

  async function createNewUser(e: React.FormEvent) {
    e.preventDefault();

    if (!masterPassword.trim()) {
      setMessage("Please enter a master password.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(`${API_BASE}/new-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          master_password: masterPassword,
        }),
      });

      const data = await handleApiResponse(response);

      setIsLoggedIn(true);
      setMasterPassword("");
      setMessage(data.message || "New user created successfully.");
      await fetchAccounts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create user.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();

    if (!masterPassword.trim()) {
      setMessage("Please enter your master password.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          master_password: masterPassword,
        }),
      });

      const data = await handleApiResponse(response);

      setIsLoggedIn(true);
      setMasterPassword("");
      setMessage(data.message || "Login successful.");
      await fetchAccounts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not log in.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAccounts() {
    try {
      const response = await fetch(`${API_BASE}/accounts`);
      const data = await handleApiResponse(response);

      setAccounts(data.accounts || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not fetch accounts.",
      );
    }
  }

  async function addAccount(e: React.FormEvent) {
    e.preventDefault();

    if (
      !accountName.trim() ||
      !url.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      setMessage("Please fill out all account fields.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(`${API_BASE}/add-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: accountName,
          url,
          username,
          password,
        }),
      });

      const data = await handleApiResponse(response);

      setAccountName("");
      setUrl("");
      setUsername("");
      setPassword("");
      setRevealedPasswords({});

      setMessage(data.message || "Account added successfully.");
      await fetchAccounts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not add account.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function getPassword(name: string) {
    if (revealedPasswords[name]) {
      setRevealedPasswords((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(`${API_BASE}/get-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await handleApiResponse(response);

      setRevealedPasswords((prev) => ({
        ...prev,
        [name]: data.password,
      }));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not retrieve password.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteAccount(name: string) {
    const confirmed = window.confirm(`Delete ${name}?`);

    if (!confirmed) return;

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(`${API_BASE}/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await handleApiResponse(response);

      setRevealedPasswords((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });

      setMessage(data.message || "Account deleted successfully.");
      await fetchAccounts();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete account.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function generatePassword() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    const array = new Uint32Array(18);
    crypto.getRandomValues(array);

    const generated = Array.from(
      array,
      (num) => chars[num % chars.length],
    ).join("");
    setPassword(generated);
    setMessage("Generated a strong password.");
  }

  function logout() {
    setIsLoggedIn(false);
    setAccounts([]);
    setRevealedPasswords({});
    setMasterPassword("");
    setMessage("Logged out of password manager demo.");
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchAccounts();
    }
  }, [isLoggedIn]);

  return (
    <div> 
      <div className = "box"/>
    <main className="pm-page">
      <section className="pm-container">
        <div className="pm-header">
          <p className="pm-eyebrow">Portfolio Project Demo</p>
          <h1>Password Manager</h1>
          <p>
            Built a password manager that encrypts stored credentials using a
            PBKDF-derived master key with salt and iterations, saving only
            encrypted password data to JSON. This demo connects a Next.js
            frontend to my original Python password manager code through a
            FastAPI backend. The Python backend handles account storage,
            encryption, decryption, and deletion. Passwords are encrypted before
            storage using Fernet symmetric encryption. The encryption key is
            derived from your master password using PBKDF2-HMAC-SHA256 with a
            unique salt and 1,200,000 iterations.
          </p>
        </div>

        <div className="pm-warning">
          <strong>Demo Warning:</strong> Do not enter real passwords. This is a
          portfolio demo for testing the project interface.
        </div>

        {message && <div className="pm-message">{message}</div>}

        {!isLoggedIn ? (
          <div className="pm-card pm-auth-card">
            <div className="pm-tabs">
              <button
                className={mode === "returning" ? "active" : ""}
                onClick={() => {
                  setMode("returning");
                  setMessage("");
                }}
              >
                Returning User
              </button>

              <button
                className={mode === "new" ? "active" : ""}
                onClick={() => {
                  setMode("new");
                  setMessage("");
                }}
              >
                New User
              </button>
            </div>

            <h2>{mode === "new" ? "Create New User" : "Unlock Vault"}</h2>

            <p className="pm-muted">
              {mode === "new"
                ? "Create a master password for the demo vault."
                : "Enter your master password to unlock the saved vault."}
            </p>

            <form
              onSubmit={mode === "new" ? createNewUser : login}
              className="pm-form"
            >
              <label>
                Master Password
                <input
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter master password"
                />
              </label>

              <button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Loading..."
                  : mode === "new"
                    ? "Create User"
                    : "Unlock Vault"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="pm-toolbar">
              <div>
                <h2>Your Password Vault</h2>
                <p className="pm-muted">
                  Add accounts, reveal passwords, and delete saved entries.
                </p>
              </div>

              <button className="pm-secondary" onClick={logout}>
                Log Out
              </button>
            </div>

            <div className="pm-grid">
              <div className="pm-card">
                <h2>Add New Account</h2>

                <form onSubmit={addAccount} className="pm-form">
                  <label>
                    Account Name
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Example: Facebook"
                    />
                  </label>

                  <label>
                    URL
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Example: facebook.com"
                    />
                  </label>

                  <label>
                    Username
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Example: mihirshankar"
                    />
                  </label>

                  <label>
                    Password
                    <div className="pm-password-row">
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter or generate password"
                      />

                      <button
                        type="button"
                        className="pm-secondary"
                        onClick={generatePassword}
                      >
                        Generate
                      </button>
                    </div>
                  </label>

                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Add Account"}
                  </button>
                </form>
              </div>

              <div className="pm-card">
                <h2>Saved Accounts</h2>

                {accounts.length === 0 ? (
                  <p className="pm-muted">No accounts saved yet.</p>
                ) : (
                  <div className="pm-account-list">
                    {accounts.map((account) => (
                      <div className="pm-account" key={account.name}>
                        <div className="pm-account-info">
                          <h3>{account.name}</h3>
                          <p>
                            <strong>URL:</strong> {account.url}
                          </p>
                          <p>
                            <strong>Username:</strong> {account.username}
                          </p>
                          <p>
                            <strong>Password:</strong>{" "}
                            {revealedPasswords[account.name] || "••••••••••••"}
                          </p>
                        </div>

                        <div className="pm-account-actions">
                          <button
                            className="pm-secondary"
                            onClick={() => getPassword(account.name)}
                            disabled={isLoading}
                          >
                            {revealedPasswords[account.name] ? "Hide" : "Show"}
                          </button>

                          <button
                            className="pm-danger"
                            onClick={() => deleteAccount(account.name)}
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pm-card pm-notes">
              <h2>Technical Notes</h2>
              <ul>
                <li>Frontend built with Next.js, React, and TypeScript.</li>
                <li>Backend built with FastAPI.</li>
                <li>Original password manager logic remains in Python.</li>
                <li>
                  React sends requests to Python instead of rewriting the Python
                  classes.
                </li>
                <li>
                  Password retrieval is intentionally hidden behind a Show
                  button.
                </li>
                <li>
                  Passwords are encrypted using before they are written to the
                  JSON file. This means the saved file does not store your
                  original plain-text password.
                </li>
              </ul>
            </div>
          </>
        )}
      </section>
    </main>
    </div>
  );
}
