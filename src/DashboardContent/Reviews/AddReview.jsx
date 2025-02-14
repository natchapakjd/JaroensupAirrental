import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust the import based on your Auth context path

const AddReview = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [review, setReview] = useState({
    task_id: '',
    tech_id: '',
    user_id: user.user.id,
    rating: 0,
    comment: '',
  });
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  const translations = {
    en: {
      pageTitle: 'Add Review',
      taskLabel: 'Task ID:',
      techLabel: 'Technician ID:',
      userLabel: 'User ID:',
      ratingLabel: 'Rating:',
      commentLabel: 'Comment:',
      addButton: 'Add Review',
      addingButton: 'Adding...',
      successAdd: 'Review Added!',
      errorFetch: 'Failed to load tasks, technicians, or users.',
      errorAdd: 'Failed to add review.',
    },
    th: {
      pageTitle: 'เพิ่มรีวิว',
      taskLabel: 'รหัสงาน:',
      techLabel: 'รหัสช่าง:',
      userLabel: 'รหัสผู้ใช้:',
      ratingLabel: 'คะแนน:',
      commentLabel: 'ความคิดเห็น:',
      addButton: 'เพิ่มรีวิว',
      addingButton: 'กำลังเพิ่ม...',
      successAdd: 'เพิ่มรีวิวแล้ว!',
      errorFetch: 'โหลดงาน ช่าง หรือผู้ใช้ไม่สำเร็จ',
      errorAdd: 'เพิ่มรีวิวไม่สำเร็จ',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksResponse, techniciansResponse, usersResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/tasks`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/technicians`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/users`),
        ]);
        setTasks(tasksResponse.data);
        setTechnicians(techniciansResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: translations[language].errorFetch,
          icon: 'error',
        });
      }
    };
    fetchData();
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/review`, review);
      if (response.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: translations[language].successAdd,
          text: response.data.message,
        });
        navigate('/dashboard/reviews');
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: translations[language].errorAdd,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{translations[language].pageTitle}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="task_id">
            {translations[language].taskLabel}
          </label>
          <select
            id="task_id"
            name="task_id"
            value={review.task_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">{translations[language].taskLabel}</option>
            {tasks.map((task) => (
              <option key={task.task_id} value={task.task_id}>
                {task.task_id} {task.description}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="tech_id">
            {translations[language].techLabel}
          </label>
          <select
            id="tech_id"
            name="tech_id"
            value={review.tech_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">{translations[language].techLabel}</option>
            {technicians.map((tech) => (
              <option key={tech.tech_id} value={tech.tech_id}>
                {tech.tech_id}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="user_id">
            {translations[language].userLabel}
          </label>
          <select
            id="user_id"
            name="user_id"
            value={review.user_id}
            onChange={handleChange}
            required
            className="select select-bordered w-full"
          >
            <option value="">{translations[language].userLabel}</option>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.user_id}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="rating">
            {translations[language].ratingLabel}
          </label>
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
          <label className="block mb-2" htmlFor="comment">
            {translations[language].commentLabel}
          </label>
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
          {loading ? translations[language].addingButton : translations[language].addButton}
        </button>
      </form>
    </div>
  );
};

export default AddReview;
