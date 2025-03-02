import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
const translations = {
  en: {
    userList: "User List",
    addTechnician: "Add Technician",
    addUser: "Add User",
    searchUser: "Search User",
    allRoles: "All Roles",
    avatar: "Avatar",
    username: "Username",
    email: "Email",
    role: "Role",
    createdAt: "Created At",
    actions: "Actions",
    noUsersFound: "No users found.",
    details: "Details",
    edit: "Edit",
    delete: "Delete",
    confirmDeleteTitle: "Are you sure?",
    confirmDeleteText: "You won't be able to revert this!",
    confirmDeleteButton: "Yes, delete it!",
    cancelButton: "Cancel",
    deleted: "Deleted!",
    deletedText: "User has been deleted.",
    previous: "previous",
    next: "next",
    of: "of",
    page: "page",
  },
  th: {
    userList: "รายการผู้ใช้",
    addTechnician: "เพิ่มช่างเทคนิค",
    addUser: "เพิ่มผู้ใช้",
    searchUser: "ค้นหาผู้ใช้",
    allRoles: "ทุกบทบาท",
    avatar: "อวาตาร์",
    username: "ชื่อผู้ใช้",
    email: "อีเมล",
    role: "บทบาท",
    createdAt: "วันที่สร้าง",
    actions: "การกระทำ",
    noUsersFound: "ไม่พบผู้ใช้",
    details: "รายละเอียด",
    edit: "แก้ไข",
    delete: "ลบ",
    confirmDeleteTitle: "คุณแน่ใจหรือไม่?",
    confirmDeleteText: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
    confirmDeleteButton: "ใช่, ลบมัน!",
    cancelButton: "ยกเลิก",
    deleted: "ลบแล้ว!",
    deletedText: "ผู้ใช้ได้ถูกลบแล้ว",
    previous: "ก่อนหน้า",
    next: "ถัดไป",
    of: "จาก",
    page: "หน้า",
  },
};

const UserContent = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(
    localStorage.getItem("language" || "th")
  );
  const cookies = new Cookies();
  const token = cookies.get("authToken");
  const decodeToken = jwtDecode(token);
  const user_id = decodeToken.id;
  const pageLimit = 10;

  useEffect(() => {
    fetchUsers(currentPage);
    fetchRoles();
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/roles`
      );
      setRoles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDelete = async (userId, name) => {
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
          axios.post(`${import.meta.env.VITE_SERVER_URL}/adminLog`, {
            admin_id: user_id,
            action: `ลบผู้ใช้ไอดี ${userId} ชื่อ-สกุล:${name}`,
          });
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

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto p-8">
      <div className="font-prompt p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-xl font-semibold my-5">
            {translations[language].userList}
          </h2>
          <div className="flex justify-end gap-2 mb-4">
            <Link to="/dashboard/user/add-tech">
              <button className="btn bg-success hover:bg-success text-white">
                {translations[language].addTechnician}
              </button>
            </Link>
            <Link to="/dashboard/user/add">
              <button className="btn bg-blue hover:bg-blue text-white">
                {translations[language].addUser}
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
              <option value=""> {translations[language].role}</option>
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
                <th> {translations[language].avatar}</th>
                <th> {translations[language].username}</th>
                <th> {translations[language].email}</th>
                <th> {translations[language].role}</th>
                <th> {translations[language].createdAt}</th>
                <th> {translations[language].actions}</th>
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
                            {translations[language].details}
                          </button>
                        </Link>
                        <Link to={`/dashboard/user/edit/${user.user_id}`}>
                          <button className="btn btn-success text-white btn-xs">
                            {translations[language].edit}
                          </button>
                        </Link>
                        <button
                          className="btn btn-error btn-xs text-white"
                          onClick={() =>
                            handleDelete(
                              user.user_id,
                              `${user.firstname} ${user.lastname}`
                            )
                          }
                        >
                          {translations[language].delete}
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
            {translations[language].previous}
          </p>
          <span className="flex items-center justify-center">
            {translations[language].page} {currentPage}{" "}
            {translations[language].of} {totalPages}
          </span>
          <p
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-black"
            }`}
          >
            {translations[language].next}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserContent;
