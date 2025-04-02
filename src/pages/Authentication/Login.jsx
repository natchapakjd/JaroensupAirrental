import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

// ✅ Object สำหรับแปลภาษา
const translations = {
  th: {
    title: "เข้าสู่ระบบ",
    username: "ชื่อผู้ใช้",
    password: "รหัสผ่าน",
    loginBtn: "เข้าสู่ระบบ",
    noAccount: "ยังไม่มีบัญชี?",
    register: "สมัครสมาชิก",
    loginSuccess: "ล็อคอินสำเร็จ",
    loginFail: "โปรดลองอีกครั้ง",
    forgotPassword: "ลืมรหัสผ่าน",
  },
  en: {
    title: "Login",
    username: "Username",
    password: "Password",
    loginBtn: "Login",
    noAccount: "Don't have an account?",
    register: "Register",
    loginSuccess: "Login Successful",
    loginFail: "Please try again",
    forgotPassword: "Forgot password"
  },
};

const Login = () => {
  const cookies = new Cookies();
  const [username, setUsername] = useState("");
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, {
        username,
        password,
      });

      Swal.fire({
        title: translations[language].loginSuccess,
        icon: "success",
      });

      const receivedToken = response.data.token;
      cookies.set("authToken", receivedToken, { path: "/" });
      const decodedToken = jwtDecode(receivedToken);

      decodedToken.role === 3 || decodedToken.role === 2
        ? setTimeout(() => {
            navigate("/dashboard/home");
          }, 800)
        : setTimeout(() => {
            navigate("/");
          }, 800);
    } catch (err) {
      Swal.fire({
        title: translations[language].loginFail,
        icon: "error",
      });
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
          <form onSubmit={handleLogin}>
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input input-bordered w-full bg-white"
                placeholder={translations[language].username}
                pattern="^[a-zA-Z0-9_-]{3,20}$"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full bg-white"
                placeholder={translations[language].password}
              />
            </div>
            <button
              type="submit"
              className="btn bg-blue hover:bg-blue w-full text-white"
            >
              {translations[language].loginBtn}
            </button>
          </form>
          <Link to="/forgot-password" className="text-blue-500 hover:underline flex justify-end my-2">
            {translations[language].forgotPassword || "Forgot Password?"}
          </Link>
          <p className="mt-4 text-center text-sm text-gray-600">
            {translations[language].noAccount}{" "}
            <Link to="/register" className="text-blue">
              {translations[language].register}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
