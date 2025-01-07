import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";

const EditTechProfile = () => {
  const { techId } = useParams();
  const [loading,setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nationality: "",
    isOutsource: false,
    work_experience: "",
    special_skills: "",
    background_check_status: "",
    bank_account_number: "",
    start_date: "",
    status_id: "",
    id_card_image_url: "",
    driver_license_image_url: "",
    criminal_record_image_url: "",
    additional_image_url: "",
  });

  const [statuses, setStatuses] = useState([]); // State for storing statuses

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch technician data to pre-fill the form
        const techResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/technician/${techId}`);
        setFormData(techResponse.data[0]);

        // Fetch statuses for dropdown
        const statusResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/statuses`);
        setStatuses(statusResponse.data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching technician or statuses:", error);
      }
    };

    fetchData();
  }, [techId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/technician/${techId}`, formData);
      alert("Technician updated successfully");
    } catch (error) {
      console.error("Error updating technician:", error);
    }
  };

  if(loading){
    return <Loading/>
  }

  return (
    <div className="p-4 w-full h-screen">
      <h1 className="text-xl font-bold mb-4">Edit Technician Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Nationality */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Work Experience */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Work Experience</label>
            <input
              type="text"
              name="work_experience"
              value={formData.work_experience}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Special Skills */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Special Skills</label>
            <input
              type="text"
              name="special_skills"
              value={formData.special_skills}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Background Check Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Background Check Status</label>
            <input
              type="text"
              name="background_check_status"
              value={formData.background_check_status}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Bank Account Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Bank Account Number</label>
            <input
              type="text"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status_id"
              value={formData.status_id}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </div>
          {/* ID Card Image URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium">ID Card Image URL</label>
            <input
              type="text"
              name="id_card_image_url"
              value={formData.id_card_image_url}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Driver License Image URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Driver License Image URL</label>
            <input
              type="text"
              name="driver_license_image_url"
              value={formData.driver_license_image_url}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Criminal Record Image URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Criminal Record Image URL</label>
            <input
              type="text"
              name="criminal_record_image_url"
              value={formData.criminal_record_image_url}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Additional Image URL */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Additional Image URL</label>
            <input
              type="text"
              name="additional_image_url"
              value={formData.additional_image_url}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          {/* Is Outsource */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Is Outsource</label>
            <input
              type="checkbox"
              name="isOutsource"
              checked={formData.isOutsource}
              onChange={handleChange}
              className="h-5 w-5"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue text-white px-4 py-2 flex justify-end rounded hover:bg-blue"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTechProfile;
