import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { MoonIcon } from "../icons/MoonIcon";
import { SunIcon } from "../icons/SunIcon";

export function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
    });
    navigate("/signin");
  }

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen w-full flex justify-center items-center p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
      }`}
    >
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-2 rounded-md ${
          darkMode
            ? "bg-gray-700 text-yellow-300"
            : "bg-indigo-100 text-indigo-600"
        }`}
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
      </button>

      <div
        className={`backdrop-blur-xl rounded-lg border shadow-2xl max-w-md w-full p-10 transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/70 border-gray-700 shadow-gray-900/30"
            : "bg-white/70 border-gray-100 shadow-indigo-100/20"
        }`}
      >
        <div className="text-center mb-12">
          <h1
            className={`text-5xl font-bold mb-4 font-['Poppins'] ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Create Account
          </h1>
          <p
            className={`text-lg font-light ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Sign up to get started
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup();
          }}
          className="space-y-7"
        >
          <div className="space-y-2">
            <label
              htmlFor="username"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Username
            </label>
            <Input
              placeholder="Enter your username"
              reference={usernameRef}
              type="text"
              className={`w-full p-3 rounded-md border-2 focus:ring-2 transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700/80 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30 text-white backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-gray-800 backdrop-blur-sm"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <Input
              placeholder="Enter your password"
              reference={passwordRef}
              type="password"
              className={`w-full p-3 rounded-md border-2 focus:ring-2 transition-all duration-200 ${
                darkMode
                  ? "bg-gray-700/80 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/30 text-white backdrop-blur-sm"
                  : "bg-white/80 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-gray-800 backdrop-blur-sm"
              }`}
            />
          </div>

          <div className="pt-3">
            <Button
              variant="primary"
              text="Sign Up"
              onClick={signup}
              className={`w-full py-3 rounded-md font-medium text-white transition-all duration-200 ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
              }`}
            />
          </div>

          <div
            className={`text-center text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <a
              href="/signin"
              className={`font-medium transition-colors duration-200 ${
                darkMode
                  ? "text-indigo-400 hover:text-indigo-300"
                  : "text-indigo-600 hover:text-indigo-500"
              }`}
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
