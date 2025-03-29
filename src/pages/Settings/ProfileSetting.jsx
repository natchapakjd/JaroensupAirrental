import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Loading from "../../components/Loading";

const translations = {
  th: {
    profileSettings: "ตั้งค่าข้อมูลส่วนตัว",
    firstName: "ชื่อจริง",
    lastName: "นามสกุล",
    email: "อีเมล",
    phone: "เบอร์โทร",
    age: "อายุ",
    address: "ที่อยู่",
    gender: "เพศ",
    dateOfBirth: "วันเกิด",
    profileImage: "รูปโปรไฟล์",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
    successTitle: "สำเร็จ!",
    successMessage: "ข้อมูลถูกอัปเดตเรียบร้อย!",
    errorTitle: "เกิดข้อผิดพลาด!",
    ageError: "อายุต้องอยู่ระหว่าง 1 - 100",
  },
  en: {
    profileSettings: "Profile Settings",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    age: "Age",
    address: "Address",
    gender: "Gender",
    dateOfBirth: "Date of Birth",
    profileImage: "Profile Image",
    saveChanges: "Save Changes",
    successTitle: "Success!",
    successMessage: "Profile updated successfully!",
    errorTitle: "Error!",
    ageError: "Age must between 1 - 100",
  },
};

const ProfileSetting = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const location = useLocation();

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

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    gender_id: "",
    date_of_birth: "",
    profile_image: null,
  });

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
          gender_id: data.gender_id || "",
          date_of_birth: data.date_of_birth || "",
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "date_of_birth" && value) {
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        newData.age = age.toString();
      }
      return newData;
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate age from date_of_birth
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Check minimum age of 18
    if (age < 1 || isNaN(age) || age > 100) {
      Swal.fire({
        title: translations[language].errorTitle,
        text: translations[language].ageError,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("firstname", formData.firstname);
    formDataToSend.append("lastname", formData.lastname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("age", age.toString());
    formDataToSend.append("address", formData.address);
    formDataToSend.append("gender_id", formData.gender_id);
    formDataToSend.append("date_of_birth", formData.date_of_birth);
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/user/${userId}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        const updatedProfile = response.data;
        setProfile(updatedProfile);
        Swal.fire({
          title: translations[language].successTitle,
          text: translations[language].successMessage,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: translations[language].errorTitle,
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className="container mx-auto p-6 font-prompt bg-white my-5">
        <h1 className="text-2xl font-bold mb-4">
          {translations[language].profileSettings}
        </h1>
        {error && <div className="alert alert-error">{error}</div>}
        {profile ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              {profile.firstname} {profile.lastname}
            </h2>
            <div className="flex items-center mb-4">
              <img
                src={profile.image_url || "/placeholder-image.jpg"}
                alt={profile.firstname || "Profile"}
                className="w-24 h-24 rounded-xl mr-4"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="label">{translations[language].firstName}</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                  required
                />
              </div>
              <div>
                <label className="label">{translations[language].lastName}</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                  required
                />
              </div>
              <div>
                <label className="label">{translations[language].email}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label className="label">{translations[language].dateOfBirth}</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                  required
                />
              </div>
              <div>
                <label className="label">{translations[language].phone}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input input-bordered w-full mt-2"
                />
              </div>
              <div>
                <label className="label">{translations[language].gender}</label>
                <select
                  name="gender_id"
                  value={formData.gender_id}
                  onChange={handleChange}
                  className="select select-bordered w-full mt-2"
                >
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </div>
              <div>
                <label className="label">{translations[language].address}</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full mt-2"
                />
              </div>
              <div>
                <label className="label">{translations[language].profileImage}</label>
                <input
                  type="file"
                  name="profile_image"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full h-10"
                />
              </div>
              <button
                className="btn bg-blue mt-4 text-white hover:bg-blue"
                type="submit"
              >
                {translations[language].saveChanges}
              </button>
            </form>
          </div>
        ) : (
          <Loading />
        )}
      </div>
      {!isDashboard && <Footer />}
    </>
  );
};

export default ProfileSetting;