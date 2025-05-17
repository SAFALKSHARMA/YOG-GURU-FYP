import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Settings = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { userData } = useContext(AppContent);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/change-password",
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          userId: userData?.userId,
        }
      );

      message.success("Password changed successfully!", 5);

      // Reset form and hide after successful submission
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (error) {
      console.error("Password change failed:", error);
      message.error(
        error.response?.data?.message ||
          "Failed to change password. Please try again.",
        5
      );
    }
  };

  const showDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setConfirmationText("");
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/user/delete/${userData?.userId}`
      );
      message.success("Account deleted successfully!", 5);

      // Remove auth token from cookies
      Cookies.remove("token");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Account deletion failed:", error);
      message.error(
        error.response?.data?.message ||
          "Failed to delete account. Please try again.",
        5
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalVisible(false);
    }
  };

  const isConfirmDisabled = confirmationText !== "delete my account";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
          {/* Password Section */}
          <div className="p-8">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Password
                </h2>
                <p className="text-sm text-gray-500">
                  Update your account password
                </p>
              </div>
            </div>

            {showPasswordForm ? (
              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full px-4 py-3 rounded-lg text-gray-700 bg-gray-50 border ${
                      errors.oldPassword
                        ? "border-red-300 ring-1 ring-red-300"
                        : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200`}
                    required
                  />
                  {errors.oldPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.oldPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full px-4 py-3 rounded-lg text-gray-700 bg-gray-50 border ${
                      errors.newPassword
                        ? "border-red-300 ring-1 ring-red-300"
                        : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200`}
                    required
                    minLength="6"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`block w-full px-4 py-3 rounded-lg text-gray-700 bg-gray-50 border ${
                      errors.confirmPassword
                        ? "border-red-300 ring-1 ring-red-300"
                        : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200`}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setErrors({});
                    }}
                    className="flex-1 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="mt-6 w-full px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Change Password
              </button>
            )}
          </div>

          <div className="w-full h-px bg-gray-100"></div>

          {/* Delete Account Section */}
          <div className="p-8">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Delete Account
                </h2>
                <p className="text-sm text-gray-500">
                  Permanently remove your account and all data
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">
                Once you delete your account, all of your data will be
                permanently removed. This action cannot be undone.
              </p>
            </div>

            <button
              onClick={showDeleteModal}
              className="mt-6 w-full px-4 py-3 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Confirm Account Deletion
            </span>
          </div>
        }
        visible={isDeleteModalVisible}
        onOk={handleDeleteAccount}
        onCancel={handleDeleteCancel}
        okText="Delete Account"
        cancelText="Cancel"
        okButtonProps={{
          disabled: isConfirmDisabled,
          loading: isDeleting,
          danger: true,
          style: {
            background: isConfirmDisabled ? undefined : "#EF4444",
            borderColor: isConfirmDisabled ? undefined : "#EF4444",
          },
        }}
        cancelButtonProps={{
          style: { borderColor: "#E5E7EB", color: "#374151" },
        }}
        width={480}
        bodyStyle={{ padding: "20px" }}
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm text-red-600">
              This action cannot be undone. This will permanently delete your
              account and all associated data.
            </p>
          </div>

          <p className="text-gray-700">
            To confirm, please type{" "}
            <span className="font-medium text-red-600">
              "delete my account"
            </span>{" "}
            in the box below:
          </p>

          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="delete my account"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
