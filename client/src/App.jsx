import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./components/Auth/SignUpPage";
import SignInPage from "./components/Auth/SignInPage";
import UserDashboard from "./components/User/UserDashboard";
import ProtectedRoutes from "./components/Routes/ProtectedRoutes";
import UserLayout from "./components/Layouts/UserLayout";
import PublicLayout from "./components/Layouts/PublicLayout";
import UserProfile from "./components/User/UserProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Route>

        {/* User */}
        <Route element={<ProtectedRoutes />}>
          <Route path="dashboard" element={<UserLayout />}>
            <Route index element={<Navigate to="new" replace />} />
            <Route path="new" element={<UserDashboard mode="new" />} />
            <Route path="chat/:chatId" element={<UserDashboard mode="existing" />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

      </Routes>


    </BrowserRouter>
  );
}