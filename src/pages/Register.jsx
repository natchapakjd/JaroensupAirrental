import React from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if ((email, password, username)) {
      try {
        const response = await axios.post("http://localhost:3000/register", {
          username,
          password,
          email,
        });
        Swal.fire({
          title: "สมัครสมาชิกสำเร็จ",
          icon: "success",
        });
        setTimeout(() => {
          navigate("/login");
        }, 800);
      } catch (err) {
        Swal.fire({
          title: "สมัครสมาชิกไม่สำเร็จ",
          icon: "error",
        });
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-black">Register</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="input input-bordered w-full bg-white"
                placeholder="Username"
                onChange={handleUsernameChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input input-bordered w-full bg-white"
                placeholder="Email"
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input input-bordered w-full bg-white"
                placeholder="Password"
                onChange={handlePasswordChange}
              />
            </div>
            <button
              className="btn btn btn-success w-full"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
