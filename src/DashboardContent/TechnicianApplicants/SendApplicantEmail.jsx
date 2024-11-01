import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const SendApplicantEmail = () => {
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      Swal.fire({
        title: 'Please fill in all the fields',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/applicant-email/${id}`, 
        { username, password }
      );

      if (response.status === 200) {
        Swal.fire({
          title: 'Email sent successfully!',
          text: 'The applicant’s login details have been sent to their email.',
          icon: 'success',
        });
        navigate('/dashboard/applicants');  // Redirect after success
      }
    } catch (error) {
      Swal.fire({
        title: 'An error occurred!',
        text: error.response?.data?.message || error.message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <h2 className="text-xl font-semibold mt-8 mb-5">Send Login Details to Applicant</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="username" className="block text-base font-medium text-gray-700 ">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full text-base text-gray-800 border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full text-base text-gray-800 border border-gray-300 rounded-md p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="btn bg-blue hover:bg-blue text-white w-full p-3"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Send Login Details'}
        </button>
      </form>
    </div>
  );
};

export default SendApplicantEmail;
