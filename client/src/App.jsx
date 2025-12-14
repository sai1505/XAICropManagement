import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./components/Auth/SignUpPage";
import SignInPage from "./components/Auth/SignInPage";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}