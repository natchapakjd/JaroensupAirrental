import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust the import based on your Auth context path

const AddReview = () => {
  const navigate = useNavigate();
  const user = useAuth(); // Get user data for authorization
  const [review, setReview] = useState({
    task_id: '',
    tech_id: '',
    user_id: user.user.id, // Assuming user ID is from context
    rating: 0,
    comment: '',
  });
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [technicians, setTechnicians] = useState([]); // State to store technicians
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(false);

  // Fetch tasks, technicians, and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, techniciansResponse, usersResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/tasks`), // Adjust the endpoint based on your API
          axios.get(`${import.meta.env.VITE_SERVER_URL}/technicians`), // Adjust the endpoint based on your API
          axios.get(`${import.meta.env.VITE_SERVER_URL}/users`), // Adjust the endpoint based on your API
        ]);
        setTasks(tasksResponse.data);
        setTechnicians(techniciansResponse.data);
        setUsers(usersResponse.data); // Set fetched users
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load tasks, technicians, or users.',
          icon: 'error',
        });
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/review`, review);
      if (response.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Review Added!',
          text: response.data.message,
        });
        navigate('/dashboard/reviews'); // Redirect to the reviews list or any other page
      }
    } catch (err) {
      console.error('Error adding review:', err);
      await Swal.fire({
        title: 'Error',
        text: 'Failed to add review.',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Add Review</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md text-sm font-medium">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="task_id">Task ID:</label>
          <select
            id="task_id"
            name="task_id"
            value={review.task_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select a task</option>
            {tasks.map((task) => (
              <option key={task.task_id} value={task.task_id}>
                {task.task_id} {task.description} {/* Adjust based on your task object structure */}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="tech_id">Technician ID:</label>
          <select
            id="tech_id"
            name="tech_id"
            value={review.tech_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select a technician</option>
            {technicians.map((tech) => (
              <option key={tech.tech_id} value={tech.tech_id}>
                {tech.tech_id} {/* Adjust based on your technician object structure */}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="user_id">User ID:</label>
          <select
            id="user_id"
            name="user_id"
            value={review.user_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.user_id}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={review.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            name="comment"
            value={review.comment}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className={`btn bg-blue text-white hover:bg-blue ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Review'}
        </button>
      </form>
    </div>
  );
};

export default AddReview;
