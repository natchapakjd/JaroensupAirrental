import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";
import Loading from "../../components/Loading";

const UserContent = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,setLoading] =useState(true)
  const pageLimit = 10;

  useEffect(() => {
    fetchUsers(currentPage);
    fetchRoles();
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/users-paging?page=${page}&limit=${pageLimit}`
      );
      const { users, total } = response.data;
      setUsers(users);
      setFilteredUsers(users);
      setTotalPages(Math.ceil(total / pageLimit));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/roles`
      );
      setRoles(response.data);
      setLoading(false)
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
          fetchUsers(currentPage); // Refresh current page
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if(loading){
    return <Loading/>
  }
  return (
    <div className="font-inter mt-5 mx-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold my-5">User List</h2>
        <div className="flex justify-end gap-2 mb-4">
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="Search User"
            className="input input-bordered w-full "
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
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Avatar</th>
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
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role_name}</td>
                  <td>{format(new Date(user.created_at), "MM/dd/yyyy")}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/dashboard/user/${user.user_id}`}>
                        <button className="btn btn-ghost btn-xs">
                          Details
                        </button>
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

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <p
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`cursor-pointer ${
            currentPage === totalPages ? "text-gray-400" : "text-black"
          }`}
        >
          Previous
        </p>
        <span className="flex items-center justify-center">
          Page {currentPage} of {totalPages}
        </span>
        <p
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`cursor-pointer ${
            currentPage === totalPages ? "text-gray-400" : "text-black"
          }`}
        >
          Next
        </p>
      </div>
    </div>
  );
};

export default UserContent;
