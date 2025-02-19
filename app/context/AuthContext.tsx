

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

type User = { name: string; email: string }; // Adjust as per your actual user object structure

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextProps {
  state: AuthState;
  setAuthData: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  clearAuthData: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case "CLEAR_USER":
      return initialState;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      const parsedAuthData = JSON.parse(storedAuthData);
      dispatch({
        type: "SET_USER",
        payload: {
          user: parsedAuthData.user,
          accessToken: parsedAuthData.accessToken,
          refreshToken: parsedAuthData.refreshToken,
        },
      });
    }
  }, []);

  const setAuthData = (data: { user: User; accessToken: string; refreshToken: string }) => {
    dispatch({
      type: "SET_USER",
      payload: data,
    });
    localStorage.setItem("authData", JSON.stringify(data));
  };

  const clearAuthData = () => {
    dispatch({ type: "CLEAR_USER" });
    localStorage.removeItem("authData");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider value={{ state, setAuthData, clearAuthData, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};



