import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
     
      setProfile(data[0]);
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
      const response = await fetch(`http://localhost:3000/user/${userId}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
        {error && <div className="alert alert-error">{error}</div>}
        {profile ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              {profile.firstname} {profile.lastname}
            </h2>
            <div className="flex items-center mb-4">
              <img
                src={`data:image/jpeg;base64,${profile.profile_image}`} 
                alt={profile.firstname}
                className="w-24 h-24 rounded-full mr-4"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First Name"
                className="input input-bordered w-full mt-2"
              />
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                className="input input-bordered w-full mt-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="input input-bordered w-full mt-2"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="input input-bordered w-full mt-2"
              />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="input input-bordered w-full mt-2"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="input input-bordered w-full mt-2"
              />
              <select
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
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="input input-bordered w-full mt-2"
              />
              <input
                type="file"
                name="profile_image"
                onChange={handleFileChange}
                className="input input-bordered w-full mt-2"
              />
              <button className="btn bg-blue mt-4 text-white hover:bg-blue" type="submit">
                Save Changes
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">Loading profile...</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfileSetting;
