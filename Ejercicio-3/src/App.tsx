import "./App.css";
import LoginScreen from "./pages/LoginScreen";
import useAxiosInterceptor from "./hooks/useAxiosInterceptor";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./services/providers/AuthProvider";
import HomeScreen from "./pages/HomeScreen";
import Layout from "./pages/layouts/Layout";

function App() {
  useAxiosInterceptor();
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/home" replace /> : <LoginScreen />
            }
          />

          <Route
            path="/home"
            element={
              !isLoggedIn ? <Navigate to="/login" replace /> : <HomeScreen />
            }
          />

          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
