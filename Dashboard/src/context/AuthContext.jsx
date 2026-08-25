import { useMemo, useState } from "react";
import { loginUser, signupUser } from "../api";
import { roleMatchesSelection } from "../utils/auth";
import AuthContext from "./auth-context";

const STORAGE_KEY = "queryroute-auth";

function readStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const stored = readStoredAuth();
  const [user, setUser] = useState(stored.user ?? null);
  const [token, setToken] = useState(stored.token ?? null);

  async function login({ email, password, selectedRole, remember }) {
    const response = await loginUser({ email, password });
    if (!roleMatchesSelection(response.user, selectedRole)) {
      throw new Error("The selected role does not match this account.");
    }

    setUser(response.user);
    setToken(response.access_token);
    if (remember) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: response.user, token: response.access_token })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    return response.user;
  }

  async function signup({ email, password, fullName, departmentName }) {
    const response = await signupUser({ email, password, fullName, departmentName });
    setUser(response.user);
    setToken(response.access_token);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: response.user, token: response.access_token })
    );
    return response.user;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(user && token), login, signup, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
