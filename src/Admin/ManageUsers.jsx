import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Filter,
  RefreshCw,
  Users,
  UserCheck,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Reference for clicking outside detection
  const dropdownRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/all-users");
      if (!response.ok) {
        throw new Error("Failed to fetch users data");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = (userId) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  // Function for approve action
  const handleApprove = (userId) => {
    setIsUpdating(true);
    console.log(`Approve user with ID: ${userId}`);
    setOpenDropdownId(null);

    // Mock API call - replace with actual implementation
    setTimeout(() => {
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: "Approved" } : user
        )
      );
      setIsUpdating(false);
    }, 500);
  };

  // Function for deny action
  const handleDeny = (userId) => {
    setIsUpdating(true);
    console.log(`Deny user with ID: ${userId}`);
    setOpenDropdownId(null);

    // Mock API call - replace with actual implementation
    setTimeout(() => {
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: "Denied" } : user
        )
      );
      setIsUpdating(false);
    }, 500);
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      roleFilter === "All" ||
      (user.role && user.role === roleFilter) ||
      (!user.role && roleFilter === "User");

    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/5">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <Users className="mr-3 text-purple-600" size={28} />
              Manage Users
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="relative flex-grow md:flex-grow-0 md:w-40">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Instructor">Instructor</option>
                  <option value="User">User</option>
                </select>
              </div>

              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw
                  size={18}
                  className={`mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <RefreshCw size={24} className="animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <XCircle className="mr-3" size={20} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <Users size={40} className="mx-auto mb-3 text-gray-400" />
              <p>No users found matching your criteria.</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-sm font-medium text-gray-500 rounded-tl-lg">
                      User
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Role
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500 rounded-tr-lg text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={user.image || "/api/placeholder/40/40"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <span className="font-medium text-gray-800">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{user.email}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-white text-xs font-medium bg-green-500">
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="relative" ref={dropdownRef}>
                          <button
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => toggleDropdown(user._id)}
                            disabled={isUpdating}
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openDropdownId === user._id && (
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-100 w-48">
                              <button
                                className={`flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${
                                  user.status === "Approved"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() => handleApprove(user._id)}
                                disabled={
                                  user.status === "Approved" || isUpdating
                                }
                              >
                                <UserCheck
                                  size={16}
                                  className="mr-2 text-green-500"
                                />
                                Approve
                              </button>

                              <button
                                className={`flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${
                                  user.status === "Denied"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() => handleDeny(user._id)}
                                disabled={
                                  user.status === "Denied" || isUpdating
                                }
                              >
                                <X size={16} className="mr-2 text-red-500" />
                                Deny
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
