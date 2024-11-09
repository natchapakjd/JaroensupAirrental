import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns"; // Added date-fns for date formatting

const UserContent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users`
      );
      setUsers(response.data);
      console.log(users)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/user/${userId}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          Swal.fire({
            title: "User deleted successfully",
            icon: "success",
          });
          setUsers(users.filter((user) => user.user_id !== userId));
        } else {
          throw new Error("Failed to delete user.");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || error.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="font-inter mt-5 ">
      <div className="mb-4 flex justify-end mx-16">
        <Link to="/dashboard/user/add-tech">
            <button className="btn bg-success hover:bg-success text-white">
              Add Technician
            </button>
        </Link>
        <Link to="/dashboard/user/add">
          <button className="btn bg-blue hover:bg-blue text-white">
            Add User
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        {user.image_url ? (
                          <img
                            src={`${user.image_url}`}
                            alt={user.username}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <p>No Image</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.username}</div>
                      <div className="text-sm opacity-50">{user.firstname}</div>
                    </div>
                  </div>
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role_name}</td>
                <td>{format(new Date(user.created_at), "MM/dd/yyyy")}</td>
                <td>
                  <div className="flex gap-2">
                    <Link to={`/dashboard/user/${user.user_id}`}>
                      <button className="btn btn-ghost btn-xs">Details</button>
                    </Link>
                    <Link to={`/dashboard/user/edit/${user.user_id}`}>
                      <button className="btn btn-success text-white btn-xs">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="btn btn-error btn-xs text-white"
                      onClick={() => handleDelete(user.user_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default UserContent;
