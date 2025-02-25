import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert("Login failed! Check your username and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Fix: Connect input to state
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Fix: Connect input to state
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
