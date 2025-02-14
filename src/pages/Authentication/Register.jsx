import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

// ✅ Object สำหรับแปลภาษา
const translations = {
  th: {
    title: "สมัครสมาชิก",
    username: "ชื่อผู้ใช้",
    email: "อีเมล",
    password: "รหัสผ่าน",
    registerBtn: "สมัครสมาชิก",
    haveAccount: "มีบัญชีแล้ว?",
    login: "เข้าสู่ระบบ",
    registerSuccess: "สมัครสมาชิกสำเร็จ",
    registerFail: "สมัครสมาชิกไม่สำเร็จ",
  },
  en: {
    title: "Register",
    username: "Username",
    email: "Email",
    password: "Password",
    registerBtn: "Register",
    haveAccount: "Already have an account?",
    login: "Login",
    registerSuccess: "Registration Successful",
    registerFail: "Registration Failed",
  },
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem("language") || "th");

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("language") || "th");
    };

    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (username && email && password) {
      try {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/register`, {
          username,
          password,
          email,
        });

        Swal.fire({
          title: translations[language].registerSuccess,
          icon: "success",
        });

        setTimeout(() => {
          navigate("/login");
        }, 800);
      } catch (err) {
        Swal.fire({
          title: translations[language].registerFail,
          icon: "error",
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 flex items-center justify-center min-h-screen font-prompt">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-black">
            {translations[language].title}
          </h2>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].username}
              </label>
              <input
                type="text"
                id="username"
                className="input input-bordered w-full bg-white"
                placeholder={translations[language].username}
                value={username}
                pattern="^[a-zA-Z0-9_-]{3,20}$"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].email}
              </label>
              <input
                type="email"
                id="email"
                className="input input-bordered w-full bg-white"
                placeholder={translations[language].email}
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Please enter a valid email address."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].password}
              </label>
              <input
                type="password"
                id="password"
                className="input input-bordered w-full bg-white"
                placeholder={translations[language].password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn bg-blue hover:bg-blue text-white w-full"
            >
              {translations[language].registerBtn}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            {translations[language].haveAccount}{" "}
            <Link to="/login" className="text-blue">
              {translations[language].login}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
