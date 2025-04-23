import React, { useEffect, useState, useRef } from "react";
import {
  MoreVertical,
  Search,
  RefreshCw,
  Users,
  Trash2,
  Ban,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/user/all-users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      const usersWithStatus = data.users.map((user) => ({
        ...user,
        status: user.status || "Active",
        banReason: user.banReason || "",
      }));
      setUsers(usersWithStatus);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const toggleDropdown = (userId) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  const handleDelete = async (userId) => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/delete/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const openBanModal = (userId) => {
    setSelectedUserId(userId);
    setShowBanModal(true);
    setOpenDropdownId(null);
  };

  const handleBan = async () => {
    if (!banReason) return;
    setIsUpdating(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/ban/${selectedUserId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: banReason }),
        }
      );
      if (!res.ok) throw new Error("Failed to ban user");
      setUsers(
        users.map((user) =>
          user._id === selectedUserId
            ? {
                ...user,
                banInfo: { isBanned: true, banReason },
                status: "Banned",
              }
            : user
        )
      );
      setBanReason("");
      setShowBanModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };
  const handleUnban = async (userId) => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/user/unban/${userId}`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error("Failed to unban user");
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                banInfo: { isBanned: false, banReason: "" },
                status: "Active",
              }
            : user
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <Users className="mr-3 text-gray-600" size={28} />
              Manage Users
            </h1>

            <div className="flex space-x-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none"
                />
              </div>

              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
              <RefreshCw size={24} className="animate-spin text-gray-600" />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <X className="mr-3" size={20} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users size={40} className="mx-auto mb-3 text-gray-400" />
              <p>No users found</p>
            </div>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Ban Reason</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={user.image || "/default-user.png"}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role || "User"}</td>
                      <td className="p-4">
                        {user.banInfo?.isBanned ? "Banned" : "Active"}
                      </td>
                      <td className="p-4 max-w-xs truncate">
                        {user.banInfo?.banReason || "-"}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {user.banInfo?.isBanned ? (
                            <button
                              onClick={() => handleUnban(user._id)}
                              disabled={isUpdating}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                            >
                              Unban
                            </button>
                          ) : (
                            <div className="relative" ref={dropdownRef}>
                              <button
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                onClick={() => toggleDropdown(user._id)}
                                disabled={isUpdating}
                              >
                                <MoreVertical size={18} />
                              </button>

                              {openDropdownId === user._id && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 py-1 border w-48">
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    onClick={() => handleDelete(user._id)}
                                  >
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                  </button>
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    onClick={() => openBanModal(user._id)}
                                  >
                                    <Ban size={16} className="mr-2" />
                                    Ban
                                  </button>
                                </div>
                              )}
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

      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ban User</h2>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              rows={3}
              placeholder="Enter ban reason..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBan}
                disabled={!banReason || isUpdating}
                className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ${
                  !banReason ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Processing..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
