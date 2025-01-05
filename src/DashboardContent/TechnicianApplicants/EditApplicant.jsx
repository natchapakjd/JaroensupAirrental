import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";
const EditApplicant = () => {
  const { applicantId } = useParams();
  const [applicant, setApplicant] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    address: "",
    email: "",
    phone_number: "",
    position_applied: "",
    notes: "",
    interview_date: "",
    status_id: "",
  });
  const [images, setImages] = useState({
    id_card_image: null,
    driver_license_image: null,
    criminal_record_image: null,
    additional_image: null,
  });
  const navigate = useNavigate(); // for navigation
  const [loading, setLoading] = useState(true); // เพิ่มสถานะการโหลด
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/applicants/${applicantId}`
        );

        // Assuming the API returns an array or object with the applicant data
        if (response.data.length > 0) {
          setApplicant(response.data[0]); // Assuming response is an array, otherwise use response.data directly
        } else {
          console.error("Applicant data is empty.");
        }

        const statusesResponse = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/statuses`
        );
        if (Array.isArray(statusesResponse.data)) {
          setStatuses(statusesResponse.data);
        } else {
          console.error(
            "Statuses response is not an array:",
            statusesResponse.data
          );
        }
        setLoading(false); // กำหนดสถานะการโหลดเป็น false เมื่อโหลดข้อมูลเสร็จ
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load data",
          text: "Unable to fetch applicant data.",
        });
      }
    };

    fetchApplicantData();
  }, [applicantId]);
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth();
    if (
      month < birth.getMonth() ||
      (month === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Validate that the applicant is over 18 and interview date is not in the past
  const validateForm = () => {
    const age = calculateAge(applicant.date_of_birth);
    if (age < 18) {
      Swal.fire({
        icon: "error",
        title: "Invalid Age",
        text: "Applicant must be at least 18 years old.",
      });
      return false;
    }

    const interviewDate = new Date(applicant.interview_date);
    const today = new Date();
    if (interviewDate < today) {
      Swal.fire({
        icon: "error",
        title: "Invalid Interview Date",
        text: "Interview date cannot be in the past.",
      });
      return false;
    }

    return true;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setImages((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }
    const formData = new FormData();

   
    // Append form data
    for (const key in applicant) {
      formData.append(key, applicant[key]);
    }

    // Append image files only if they exist
    for (const key in images) {
      if (images[key]) {
        formData.append(key, images[key]);
      }
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/applicants/${applicantId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire({
        icon: "success",
        title: "Applicant updated successfully!",
      });
      // Navigate to the applicants page after successful update
      navigate("/dashboard/applicants");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update applicant",
        text: error.message,
      });
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="mx-auto p-8 bg-white rounded-lg shadow-md font-inter">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Edit Applicant
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                name="first_name"
                value={applicant.first_name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={applicant.last_name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          {/* Date of Birth, Address, Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={applicant.date_of_birth}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={applicant.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          {/* Phone Number and Position Applied */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={applicant.phone_number}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label">Position Applied</label>
              <select
                name="position_applied"
                value={applicant.position_applied}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select Position
                </option>
                <option value="maintenance">ช่างซ่อมบำรุง</option>
                <option value="installation">ช่างติดตั้ง</option>
              </select>
            </div>
          </div>

          {/* Interview Date and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Interview Date</label>
              <input
                type="date"
                name="interview_date"
                value={applicant.interview_date}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                name="status_id"
                value={applicant.status_id}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                {Array.isArray(statuses) &&
                  statuses.map((status) => (
                    <option key={status.status_id} value={status.status_id}>
                      {status.status_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
              <label className="label">Address</label>
              <textarea
                name="address"
                value={applicant.address}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                required
              />
            </div>
          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              name="notes"
              value={applicant.notes}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">ID Card</label>
              <input
                type="file"
                name="id_card_image"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">Driver License</label>
              <input
                type="file"
                name="driver_license_image"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Criminal Record</label>
              <input
                type="file"
                name="criminal_record_image"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">Additional Image</label>
              <input
                type="file"
                name="additional_image"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn bg-blue hover:bg-blue text-white w-full"
            >
              Update Applicant
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditApplicant;
