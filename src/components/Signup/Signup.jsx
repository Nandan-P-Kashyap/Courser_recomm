import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setPhno] = useState(""); // Changed from phone to phno
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/users/signup", {
        username,
        email,
        phno, // Changed from phone to phno
        password,
      });

      alert("Signup successful!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed! User may already exist.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSignup} className="flex flex-col space-y-5">
          <div>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={username} // Connected to state
              onChange={(e) => setUsername(e.target.value)} // Update state
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={email} // Connected to state
              onChange={(e) => setEmail(e.target.value)} // Update state
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={phno} // Connected to state
              onChange={(e) => setPhno(e.target.value)} // Update state
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={password} // Connected to state
              onChange={(e) => setPassword(e.target.value)} // Update state
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
