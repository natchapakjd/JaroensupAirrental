import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TaskDetails = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_SERVER_URL; // Use environment variable

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!task) {
    return <p>No task found.</p>;
  }

  return (
    <div className="p-8 rounded-lg shadow-lg w-full mx-auto font-inter h-screen">
      <h2 className="text-2xl mb-4">Task Details: {task.title}</h2>
      <div className="mb-4">
        <p><strong>ID:</strong> {task.task_id}</p>
        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Due Date:</strong> {task.due_date}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Created At:</strong> {task.created_at}</p>
        <p><strong>Start Date:</strong> {task.start_date}</p>
        <p><strong>Finish Date:</strong> {task.finish_date}</p>
        <p><strong>Address:</strong> {task.address}</p>
        <p><strong>Quantity Used:</strong> {task.quantity_used}</p>
        <p><strong>Product ID:</strong> {task.product_id}</p>
        <p><strong>User ID:</strong> {task.user_id}</p>
      </div>

      {/* Map Section */}
      {task.latitude && task.longitude && (
        <MapContainer
          center={[task.latitude, task.longitude]} // Center the map on task's lat/long
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[task.latitude, task.longitude]}>
            <Popup>{task.title}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default TaskDetails;
