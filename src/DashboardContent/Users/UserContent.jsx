import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";

const UserContent = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users`
      );
      setUsers(response.data);
      setFilteredUsers(response.data); // Initial display
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/roles`
      );
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
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
          Swal.fire("Deleted!", "User has been deleted.", "success");
          setUsers(users.filter((user) => user.user_id !== userId));
          setFilteredUsers(filteredUsers.filter((user) => user.user_id !== userId));
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

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    filterUsers(text, selectedRole);
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    filterUsers(searchText, role);
  };

  const filterUsers = (text, role) => {
    let filtered = users;

    if (text) {
      filtered = filtered.filter((user) =>
        `${user.username} ${user.firstname} ${user.lastname}`
          .toLowerCase()
          .includes(text)
      );
    }

    if (role) {
      filtered = filtered.filter((user) => user.role_name === role);
    }

    setFilteredUsers(filtered);
  };

  return (
    <div className="font-inter mt-5 mx-16">
      <h2 className="text-xl font-semibold my-5">User List</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 w-1/2">
          <input
            type="text"
            placeholder="Search User"
            className="input input-bordered w-full max-w-xs"
            value={searchText}
            onChange={handleSearch}
          />
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_name}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          {user.image_url ? (
                            <img
                              src={user.image_url}
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
                        <div className="text-sm opacity-50">
                          {user.firstname} {user.lastname}
                        </div>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserContent;
