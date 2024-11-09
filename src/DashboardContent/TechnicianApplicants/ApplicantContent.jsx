import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ApplicantContent = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/applicants`);
        setApplicants(response.data);
      } catch (err) {
        setError('Cannot load applicants data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [applicants]);

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure you want to delete this applicant?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
    });

    if (confirmation.isConfirmed) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/applicants/${id}`);
        if (response.status === 200) {
          Swal.fire({
            title: 'Applicant deleted successfully!',
            icon: 'success',
          });
          setApplicants(applicants.filter(applicant => applicant.applicant_id !== id));
        } else {
          throw new Error('Unable to delete applicant');
        }
      } catch (error) {
        Swal.fire({
          title: 'An error occurred!',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  const handleAccept = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure you want to accept this applicant?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Accept',
      cancelButtonText: 'No, Cancel',
    });

    if (confirmation.isConfirmed) {
      try {
        const acceptResponse = await axios.post(`${import.meta.env.VITE_SERVER_URL}/applicants/accept/${id}`);
        if (acceptResponse.status === 200) {
          const emailResponse = await axios.post(`${import.meta.env.VITE_SERVER_URL}/applicant-congratulations/${id}`);
          if (emailResponse.status === 200) {
            Swal.fire({
              title: 'Applicant accepted and email sent!',
              icon: 'success',
            });
          } else {
            throw new Error('Unable to send email');
          }
        }
      } catch (error) {
        Swal.fire({
          title: 'An error occurred!',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/applicants/${id}`);
  };

  const handleSendEmail = (id) => {
    navigate(`/dashboard/applicant/sending-email/${id}`); // Navigate to the SendApplicantEmail page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-full">
      <h2 className="text-xl font-semibold mt-8 mb-5">Applicants list</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Applicant ID</th>
            <th className="border border-gray-300 p-2">Firstname</th>
            <th className="border border-gray-300 p-2">Lastname</th>
            <th className="border border-gray-300 p-2">Date of birth</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Position Applied</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Applicant date</th>
            <th className="border border-gray-300 p-2">Note</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {applicants.length > 0 ? (
            applicants.map(applicant => (
              <tr key={applicant.applicant_id}>
                <td className="border border-gray-300 p-2">{applicant.applicant_id}</td>
                <td className="border border-gray-300 p-2">{applicant.first_name}</td>
                <td className="border border-gray-300 p-2">{applicant.last_name}</td>
                <td className="border border-gray-300 p-2">{new Date(applicant.date_of_birth).toLocaleDateString('en-GB')}</td>
                <td className="border border-gray-300 p-2">{applicant.email}</td>
                <td className="border border-gray-300 p-2">{applicant.position_applied}</td>
                <td className="border border-gray-300 p-2">{applicant.status_name}</td>
                <td className="border border-gray-300 p-2">{new Date(applicant.application_date).toLocaleDateString('en-GB')}</td>
                <td className="border border-gray-300 p-2">{applicant.notes || 'No notes'}</td>
                <td className="border border-gray-300 p-2">
                  {
                    applicant.status_id === 1? ( <button className="btn btn-success text-white mr-2" onClick={() => handleAccept(applicant.applicant_id)}>
                    Accept
                  </button>) : null
                  }
                   {
                    applicant.status_id === 7? (  <button className="btn btn-success  text-white mr-2" onClick={() => handleSendEmail(applicant.applicant_id)}>
                    Send Email
                  </button>) : null
                  }
                  <button className="btn bg-blue hover:bg-blue text-white" onClick={() => handleViewDetails(applicant.applicant_id)}>
                    View details
                  </button>

                 
                  <button className="btn btn-error text-white ml-2" onClick={() => handleDelete(applicant.applicant_id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="border border-gray-300 p-4">No applicants found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantContent;
