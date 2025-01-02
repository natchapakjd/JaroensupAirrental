import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loading from '../../components/Loading';

const ApplicantContent = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/applicants-paging`, {
          params: { page: currentPage, pageSize },
        });
        setApplicants(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } catch (err) {
        setError('Cannot load applicants data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [currentPage, pageSize]); // Re-fetch when page or pageSize changes

  useEffect(() => {
    // Filter applicants based on search query and status
    const filtered = applicants.filter(applicant => {
      const matchesSearch =
        applicant.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applicant.last_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === '' || applicant.status_id.toString() === filterStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredApplicants(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize)); // Update total pages based on filtered data
  }, [searchQuery, filterStatus, applicants, pageSize]);

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
    navigate(`/dashboard/applicant/sending-email/${id}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="table p-8 rounded-lg shadow-lg w-full mx-auto h-full font-inter">
      <h2 className="text-xl font-semibold mt-8 mb-5">Applicants list</h2>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by Firstname or Lastname"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input input-bordered w-full md:w-1/3"
        >
          <option value="">Filter by Status</option>
          <option value="1">Pending</option>
          <option value="7">Hiring</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300 font-inter">
        <thead className="sticky-top bg-gray-200">
          <tr>
            <th className="border p-2 text-center">Applicant ID</th>
            <th className="border p-2 text-center">Firstname</th>
            <th className="border p-2 text-center">Lastname</th>
            <th className="border p-2 text-center">Date of birth</th>
            <th className="border p-2 text-center">Email</th>
            <th className="border p-2 text-center">Position Applied</th>
            <th className="border p-2 text-center">Status</th>
            <th className="border p-2 text-center">Applicant date</th>
            <th className="border p-2 text-center">Note</th>
            <th className="border p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredApplicants.length > 0 ? (
            filteredApplicants.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(applicant => (
              <tr key={applicant.applicant_id}>
                <td className="border p-2 text-center">{applicant.applicant_id}</td>
                <td className="border p-2 text-center">{applicant.first_name}</td>
                <td className="border p-2 text-center">{applicant.last_name}</td>
                <td className="border p-2 text-center">{new Date(applicant.date_of_birth).toLocaleDateString('en-GB')}</td>
                <td className="border p-2 text-center">{applicant.email}</td>
                <td className="border p-2 text-center">{applicant.position_applied}</td>
                <td className="border p-2 text-center">{applicant.status_name}</td>
                <td className="border p-2 text-center">{new Date(applicant.application_date).toLocaleDateString('en-GB')}</td>
                <td className="border p-2 text-center">{applicant.notes || 'No notes'}</td>
                <td className="border p-2 text-center">
                  {applicant.status_id === 1 && (
                    <button className="btn btn-success text-white mr-2" onClick={() => handleAccept(applicant.applicant_id)}>
                      Accept
                    </button>
                  )}
                  {applicant.status_id === 7 && (
                    <button className="btn btn-success text-white mr-2" onClick={() => handleSendEmail(applicant.applicant_id)}>
                      Send Email
                    </button>
                  )}
                  <button className="btn bg-blue hover:bg-blue text-white" onClick={() => handleViewDetails(applicant.applicant_id)}>
                    View details
                  </button>

                  <button className="btn btn-error text-white ml-2" onClick={() => handleDelete(applicant.applicant_id)}>
                    Reject
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

      <div className="flex justify-between items-center mt-4">
        <p
          className={`cursor-pointer ${currentPage === 1 ? "text-gray-400" : "text-black"}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </p>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <p
          onClick={() => handlePageChange(currentPage + 1)}
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-400" : "text-black"}`}
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default ApplicantContent;
