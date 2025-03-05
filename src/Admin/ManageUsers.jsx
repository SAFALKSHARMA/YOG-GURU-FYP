import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import Sidebar from "./Sidebar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/all-users"
        );
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

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-purple-50">
      <div className="w-1/5">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg m-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          Manage Users
        </h1>

        {loading && (
          <p className="text-center text-gray-500">Loading users...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-center text-gray-500">No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-100">
                <th className="p-3">Image</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-purple-50">
                  <td className="p-3">
                    <img
                      src={user.image || "https://via.placeholder.com/50"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role || "User"}</td>
                  <td className="p-3 flex items-center space-x-2">
                    <button
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center"
                      title="Approve"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                      title="Deny"
                    >
                      <XCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
