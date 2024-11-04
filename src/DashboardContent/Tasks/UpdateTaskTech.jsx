import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const UpdateTaskTech = () => {
  const [statusId, setStatusId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [statuses, setStatuses] = useState([]);
  const { taskId } = useParams();

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/statuses`);
        setStatuses(response.data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    fetchStatuses();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/task-tech/${taskId}`, {
        status_id: statusId,
        start_date: startDate,
        finish_date: finishDate,
      });

      Swal.fire({
        icon: 'success',
        title: 'Task updated successfully',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update task',
        text: 'Please try again.',
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-full max-w-md bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Task</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              required
            >
              <option value="" disabled>Select Status</option>
              {statuses.map((status) => (
                <option key={status.status_id} value={status.status_id}>
                  {status.status_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Finish Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn bg-blue hover:bg-blue text-white w-full mt-4">
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTaskTech;
