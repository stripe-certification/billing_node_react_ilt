"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from "react";
import fetchClient from "@/utils/fetchClient";
import { ACTIVE_USER_STATUSES, User } from "@/types";

interface State {
  user: User | null;
  isLoading: boolean;
}

interface UserContextType extends State {
  login: (email: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (email: string) => Promise<User>;
  isLoggedIn: () => boolean;
  hasActiveSubscription: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren<unknown>) {
  const [state, setState] = useState<State>({
    user: null,
    isLoading: true,
  });

  function updateState(newState: Partial<State>) {
    setState((prevState) => {
      return { ...prevState, ...newState };
    });
  }

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await fetchClient.get("/users");
        updateState({ user: response.data || null, isLoading: false });
      } catch (error) {
        updateState({ isLoading: false });
      }
    };

    checkUserSession();
  }, []);

  async function login(email: string) {
    try {
      updateState({ isLoading: true });
      const response = await fetchClient.post("/users/login", { email });
      updateState({ user: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  }

  async function logout() {
    try {
      updateState({ isLoading: true });
      const response = await fetchClient.post("/users/logout");
      updateState({ user: response.data, isLoading: false });
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  }

  async function register(email: string) {
    try {
      updateState({ isLoading: true });
      const response = await fetchClient.post("/users", {
        email,
      });
      const user = response.data;

      if (!user) throw new Error("User should be defined");
      updateState({ user, isLoading: false });

      return response.data;
    } catch (error: any) {
      updateState({ isLoading: false });
      throw error;
    }
  }

  function isLoggedIn() {
    return !!state.user?.email;
  }

  function hasActiveSubscription() {
    if (!state.user) return false;

    return ACTIVE_USER_STATUSES.includes(state.user.status);
  }

  const contextValue = {
    ...state,
    login,
    logout,
    register,
    isLoggedIn,
    hasActiveSubscription,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUserContext(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
}
