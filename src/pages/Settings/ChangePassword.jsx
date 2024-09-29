import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Cookies from 'universal-cookie';
import { useLocation } from 'react-router-dom'; // นำเข้า useLocation
import { useAuth } from '../../context/AuthContext';

const ChangePassword = () => {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const cookies = new Cookies();
  const location = useLocation(); 
  const { user }  = useAuth();

  useEffect(() => {
    const token = cookies.get("authToken");
    if (token) {
      setUserId(user.id);
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/change-password`, {
        user_id: userId,
        newPassword,
      });
      Swal.fire({
        title: 'Success!',
        text: 'Password changed successfully!',
        icon: 'success',
        confirmButtonText: 'Okay',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error changing password.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
      console.error(error);
    }
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn bg-blue hover:bg-blue text-white w-full">
              Change Password
            </button>
          </form>
        </div>
      </div>
      {!isDashboard && <Footer />}
    </>
  );
};

export default ChangePassword;
