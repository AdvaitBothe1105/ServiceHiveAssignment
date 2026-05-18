"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import type { PublicUser } from "../lib/types";

type MeResponse = {
  user: PublicUser;
  expiresAt: string | null;
};

type UserContextValue = {
  user: PublicUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  establishSession: (user: PublicUser) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshGeneration = useRef(0);

  const establishSession = useCallback((nextUser: PublicUser) => {
    refreshGeneration.current += 1;
    setUser(nextUser);
    setIsLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    const generation = ++refreshGeneration.current;
    setIsLoading(true);

    try {
      const res = await apiFetch<MeResponse>("/auth/me");
      if (generation !== refreshGeneration.current) {
        return;
      }
      setUser(res.data?.user ?? null);
    } catch {
      if (generation !== refreshGeneration.current) {
        return;
      }
      setUser(null);
    } finally {
      if (generation === refreshGeneration.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await apiFetch<null>("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  return (
    <UserContext.Provider value={{ user, isLoading, logout, refresh, establishSession }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
