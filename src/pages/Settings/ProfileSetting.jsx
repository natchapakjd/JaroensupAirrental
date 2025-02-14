import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Loading from "../../components/Loading";

// 📌 ระบบแปลภาษา
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
    gender: "",
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
        <h1 className="text-2xl font-bold mb-4">{translations[language].profileSettings}</h1>
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
                <label className="label">{translations[language].firstName}</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} className="input input-bordered w-full mt-2" />
              </div>
              <div>
                <label className="label">{translations[language].lastName}</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className="input input-bordered w-full mt-2" />
              </div>
              <div>
                <label className="label">{translations[language].email}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input input-bordered w-full mt-2" />
              </div>
              <div>
                <label className="label">{translations[language].phone}</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input input-bordered w-full mt-2" />
              </div>
              <div>
                <label className="label">{translations[language].gender}</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="select select-bordered w-full mt-2">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">{translations[language].profileImage}</label>
                <input type="file" name="profile_image" onChange={handleFileChange} className="file-input file-input-bordered w-full h-10" />
              </div>
              <button className="btn bg-blue mt-4 text-white hover:bg-blue-700" type="submit">
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
