import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import BackButtonEdit from "../../components/BackButtonEdit";

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    gender_id: "",
    password: "",
    date_of_birth: "",
    role_id: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "th"
  );
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const user_id = decodeToken.id;
  // Translations object
  const translations = {
    th: {
      username: "ชื่อผู้ใช้",
      password: "รหัสผ่าน",
      firstname: "ชื่อ",
      lastname: "นามสกุล",
      email: "อีเมล",
      phone: "เบอร์โทรศัพท์",
      age: "อายุ",
      address: "ที่อยู่",
      gender: "เพศ",
      date_of_birth: "วันเกิด",
      role: "บทบาท",
      profile_image: "รูปโปรไฟล์",
      addUser: "เพิ่มผู้ใช้",
      selectGender: "เลือกเพศ",
      selectRole: "เลือกบทบาท",
      submit: "เพิ่มผู้ใช้",
      success: "สำเร็จ!",
      successMessage: "เพิ่มผู้ใช้สำเร็จ",
      error: "ผิดพลาด",
      errorMessage: "ไม่สามารถเพิ่มผู้ใช้ได้",
    },
    en: {
      username: "Username",
      password: "Password",
      firstname: "First Name",
      lastname: "Last Name",
      email: "Email",
      phone: "Phone",
      age: "Age",
      address: "Address",
      gender: "Gender",
      date_of_birth: "Date of Birth",
      role: "Role",
      profile_image: "Profile Image",
      addUser: "Add User",
      selectGender: "Select gender",
      selectRole: "Select role",
      submit: "Add User",
      success: "Success!",
      successMessage: "User added successfully",
      error: "Error",
      errorMessage: "Failed to add user",
    },
  };

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/roles`
        );
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        Swal.fire({
          title: translations[language].error,
          text: translations[language].errorMessage,
          icon: "error",
        });
      }
    };

    fetchRoles();
  }, [language]);

  // Fetch genders from API
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/genders`
        );
        setGenders(response.data);
      } catch (error) {
        console.error("Error fetching genders:", error);
        Swal.fire({
          title: translations[language].error,
          text: translations[language].errorMessage,
          icon: "error",
        });
      }
    };

    fetchGenders();
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (profileImage) form.append("profile_image", profileImage);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        // Log the admin action
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/adminLog`, {
          admin_id: user_id,
          action: `เพิ่มผู้ใช้ใหม่ชื่อ ${formData.username}`,
        });

        Swal.fire({
          title: translations[language].success,
          text: translations[language].successMessage,
          icon: "success",
        });

        setFormData({
          username: "",
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          age: "",
          address: "",
          gender_id: "",
          password: "",
          date_of_birth: "",
          role_id: "",
        });
        setProfileImage(null);
      } else {
        throw new Error(translations[language].errorMessage);
      }
    } catch (error) {
      Swal.fire({
        title: translations[language].error,
        text: error.message || translations[language].errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto p-6 bg-white rounded-lg shadow-md h-screen">
      <div className="flex  w-full my-2">
          <BackButtonEdit />
          <h1 className="text-2xl font-semibold mx-2">
          {translations[language].addUser}
          </h1>
        </div>
       
        <form onSubmit={handleSubmit} className="space-y-4 text-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block  text-gray-700">
                {translations[language].username}:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                pattern="^[a-zA-Z0-9_-]{3,20}$"
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].password}:
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].firstname}:
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].lastname}:
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].email}:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].phone}:
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                pattern="^\d{10}$"
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].age}:
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                min="18"
                max="100"
                title="Age must be between 18 and 100."
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].gender}:
              </label>
              <select
                name="gender_id"
                value={formData.gender_id}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">{translations[language].selectGender}</option>
                {genders.map((gender) => (
                  <option key={gender.gender_id} value={gender.gender_id}>
                    {gender.gender_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].date_of_birth}:
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                min={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 25)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].role}:
              </label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">{translations[language].selectRole}</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].address}:
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {translations[language].profile_image}:
              </label>
              <input
                type="file"
                name="profile_image"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full h-10"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className={`bg-blue text-white hover:bg-blue py-2 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : translations[language].submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
