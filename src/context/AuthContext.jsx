import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockDB } from "@/services/mock/db";

const AuthContext = createContext(null);

const STORAGE_KEY = "employeehub.auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 600));
    const match = mockDB.users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!match) {
      throw new Error("Invalid email or password. Try the demo credentials.");
    }
    const safeUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role,
      avatarColorSeed: match.avatarColorSeed,
    };
    setUser(safeUser);
    return safeUser;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, logout, isAuthed: !!user }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
