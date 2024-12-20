import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddTechnician = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    specialization: '',
    nationality: '',
    rating: '0.00',
    isOutsource: false,
    work_experience: '',
    special_skills: '',
    certificates: '',
    background_check_status: 'pending',
    bank_account_number: '',
    start_date: '',
    notes: '',
    status_id: 1,
    id_card_image_url: '',
    driver_license_image_url: '',
    criminal_record_image_url: '',
    additional_image_url: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/technician`, formData);
      if (response.status === 201) {
        Swal.fire({
          title: 'Technician added successfully',
          icon: 'success',
        });
        setFormData({
          user_id: '',
          specialization: '',
          nationality: '',
          rating: '0.00',
          isOutsource: false,
          work_experience: '',
          special_skills: '',
          certificates: '',
          background_check_status: 'pending',
          bank_account_number: '',
          start_date: '',
          notes: '',
          status_id: 1,
          id_card_image_url: '',
          driver_license_image_url: '',
          criminal_record_image_url: '',
          additional_image_url: '',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || error.message,
        icon: 'error',
      });
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Technician</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Selection */}
        <div>
          <label htmlFor="user_id" className="block mb-1">Select User</label>
          <select
            name="user_id"
            id="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.firstname} {user.lastname} - {user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Specialization */}
        <div>
          <label htmlFor="specialization" className="block mb-1">Specialization</label>
          <input
            type="text"
            name="specialization"
            id="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        {/* Nationality */}
        <div>
          <label htmlFor="nationality" className="block mb-1">Nationality</label>
          <input
            type="text"
            name="nationality"
            id="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="bank_account_number" className="block mb-1">Bank Account Number</label>
          <input
            type="text"
            name="bank_account_number"
            id="bank_account_number"
            value={formData.bank_account_number}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
       

        {/* Special Skills */}
        <div>
          <label htmlFor="special_skills" className="block mb-1">Special Skills</label>
          <textarea
            name="special_skills"
            id="special_skills"
            value={formData.special_skills}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Background Check Status */}
        
        <div>
          <label htmlFor="work_experience" className="block mb-1">Work Experience</label>
          <textarea
            name="work_experience"
            id="work_experience"
            value={formData.work_experience}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="background_check_status" className="block mb-1">Background Check Status</label>
          <select
            name="background_check_status"
            id="background_check_status"
            value={formData.background_check_status}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        
        

        {/* Start Date */}
        <div>
          <label htmlFor="start_date" className="block mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>


        {/* ID Card Image URL */}
        <div>
          <label htmlFor="id_card_image_url" className="block mb-1">ID Card Image URL</label>
          <input
            type="text"
            name="id_card_image_url"
            id="id_card_image_url"
            value={formData.id_card_image_url}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        {/* Criminal Record Image URL */}
        <div>
          <label htmlFor="criminal_record_image_url" className="block mb-1">Criminal Record Image URL</label>
          <input
            type="text"
            name="criminal_record_image_url"
            id="criminal_record_image_url"
            value={formData.criminal_record_image_url}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="driver_license_image_url" className="block mb-1">Driver License Image URL</label>
          <input
            type="text"
            name="driver_license_image_url"
            id="driver_license_image_url"
            value={formData.driver_license_image_url}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="additional_image_url" className="block mb-1">Additional Image URL</label>
          <input
            type="text"
            name="additional_image_url"
            id="additional_image_url"
            value={formData.additional_image_url}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="isOutsource" className="flex items-center">
            <input
              type="checkbox"
              name="isOutsource"
              id="isOutsource"
              checked={formData.isOutsource}
              onChange={handleChange}
              className="checkbox"
            />
            Outsourced Technician
          </label>
        </div>
        {/* Submit Button */}
        <div className="col-span-2">
          <button type="submit" className="btn bg-blue hover:bg-blue text-white w-full">
            Add Technician
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTechnician;
