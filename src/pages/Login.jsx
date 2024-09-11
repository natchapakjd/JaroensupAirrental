import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "universal-cookie";

const Login = () => {
    const cookies = new Cookies();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            Swal.fire({
                title: "ล็อคอินสำเร็จ",
                icon: "success",
            });
            const receivedToken = response.data.token;
            cookies.set('authToken', receivedToken, { path: '/' });
            setTimeout(() => {
                navigate('/');
            }, 800);
        } catch (err) {
            Swal.fire({
                title: "ล็อคอินไม่สำเร็จ",
                icon: "error",
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-black">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={handleUsernameChange}
                                className="input input-bordered w-full bg-white"
                                placeholder="Username"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                className="input input-bordered w-full bg-white"
                                placeholder="Password"
                            />
                        </div>
                        <button type="submit" className="btn btn btn-success w-full">
                            Login
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?
                        <Link to="/register" className="text-blue-500">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
