import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ProfileSetting = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    gender: "",
    date_of_birth: "",
    profile_image: null,
  });

  const location = useLocation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`);
      if (response.status === 200) {
        const data = response.data; 
        setProfile(data);
        setFormData({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phone: data.phone || "",
          age: data.age || "",
          address: data.address || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/user/${userId}`, formDataToSend);
      if (response.status === 200) {
        const updatedProfile = response.data; 
        setProfile(updatedProfile);
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="container mx-auto p-6 font-prompt bg-white my-5">
        <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
        {error && <div className="alert alert-error">{error}</div>}
        {profile ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              {profile.firstname} {profile.lastname}
            </h2>
            <div className="flex items-center mb-4">
              <img
                src={`${profile.image_url}`} 
                alt={profile.firstname}
                className="w-24 h-24 rounded-xl mr-4"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstname" className="label">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="label">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label htmlFor="phone" className="label">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label htmlFor="age" className="label">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label htmlFor="address" className="label">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label htmlFor="gender" className="label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="select select-bordered w-full mt-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="date_of_birth" className="label">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label htmlFor="profile_image" className="label">Profile Image</label>
                <input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  onChange={handleFileChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <button className="btn bg-blue mt-4 text-white hover:bg-blue-700" type="submit">
                Save Changes
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">Loading profile...</div>
        )}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
};

export default ProfileSetting;
