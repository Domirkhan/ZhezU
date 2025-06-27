import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case "ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const rawUser = localStorage.getItem("user");
const initialState = {
  loading: false,
  isAuthenticated: !!localStorage.getItem("token"),
  user: rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null,
  token: localStorage.getItem("token"),
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Устанавливаем заголовок авторизации и localStorage
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      localStorage.setItem("token", state.token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
    // Сохраняем пользователя
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.token, state.user]);

  // Восстанавливаем пользователя при старте приложения
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !state.user) {
      loadUser();
    }
    // eslint-disable-next-line
  }, []);

  const loadUser = async () => {
    try {
      dispatch({ type: "LOADING" });
      const response = await axios.get("/api/auth/user");
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data,
          token: localStorage.getItem("token"),
        },
      });
    } catch (error) {
      dispatch({ type: "LOGOUT" });
    }
  };

  const login = async (login, password) => {
    try {
      dispatch({ type: "LOADING" });
      const response = await axios.post("/api/auth/login", { login, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || "Login failed",
      });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: "LOADING" });
      const response = await axios.post("/api/auth/register", userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
      return { success: true };
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response?.data?.message || "Registration failed",
      });
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
