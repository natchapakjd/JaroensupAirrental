import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
import { Link } from "react-router-dom";
const EditUser = () => {
  const { userId } = useParams(); // Retrieve userId from URL
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    gender_id: "", // Use gender_id instead of gender
    date_of_birth: "",
    role_id: "",
  });
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [genders, setGenders] = useState([]); // State to store gender options

  useEffect(() => {
    const fetchUserAndGenders = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/user/${userId}`
        );
        setUser(userResponse.data);

        // Fetch gender options from API
        const genderResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/genders`
        );
        setGenders(genderResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user or gender data:", error);
      }
    };

    fetchUserAndGenders();
  }, [userId]);

  const isValidDateOfBirth = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && monthDiff >= 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    if (!isValidDateOfBirth(user.date_of_birth)) {
      Swal.fire({
        title: "วันเกิดไม่ถูกต้อง",
        text: "คุณต้องมีอายุอย่างน้อย 18 ปี",
        icon: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => formData.append(key, user[key]));
      if (profileImage) formData.append("profile_image", profileImage);

      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      navigate(`/dashboard/user/${userId}`);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md font-inter h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        {user.role_id === 2 ? (
          <div className="flex justify-end gap-2 mb-4">
            <Link to={`/dashboard/user/edit-tech/${userId}`}>
              <button className="btn bg-success hover:bg-success text-white">
                Edit Technician Profile
              </button>
            </Link>
          </div>
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="text-sm font-medium">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={user.username}
              pattern="^[a-zA-Z0-9_-]{3,20}$"
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-100"
              readOnly
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700">Age:</label>
            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Address */}
          <div className="col-span-2">
            <label className="block text-gray-700">Address:</label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700">Gender:</label>
            <select
              name="gender_id"
              value={user.gender_id}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Gender</option>
              {genders.map((gender) => (
                <option key={gender.gender_id} value={gender.gender_id}>
                  {gender.gender_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700">Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={user.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-gray-700">Profile Picture:</label>
            <input
              type="file"
              name="profile_image"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full h-10"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className={`bg-blue text-white hover:bg-blue py-2 px-4 rounded`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
