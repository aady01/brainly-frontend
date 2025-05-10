import "./App.css";
import Dashboard from "./pages/Dashboard";
import { SignIn } from "./pages/SignIn";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SignUp } from "./pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
