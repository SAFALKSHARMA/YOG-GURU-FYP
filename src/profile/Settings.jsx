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
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-2xl font-bold leading-6 text-gray-900">
            Account Settings
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account preferences and settings.
          </p>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Password Section */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="text-lg font-medium text-gray-900">Password</h4>
            <p className="mt-1 text-sm text-gray-500">
              Update your account password.
            </p>

            {showPasswordForm ? (
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full border ${
                      errors.oldPassword ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    required
                  />
                  {errors.oldPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.oldPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full border ${
                      errors.newPassword ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    required
                    minLength="6"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setErrors({});
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change Password
              </button>
            )}
          </div>

          {/* Delete Account Section */}
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              Delete Account
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              Once you delete your account, you will lose all data associated
              with it.
            </p>
            <button
              onClick={showDeleteModal}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Account Deletion"
        visible={isDeleteModalVisible}
        onOk={handleDeleteAccount}
        onCancel={handleDeleteCancel}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{
          disabled: isConfirmDisabled,
          loading: isDeleting,
          danger: true,
        }}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This action cannot be undone. This will permanently delete your
            account and all associated data.
          </p>
          <p className="text-gray-700">
            To confirm, please type{" "}
            <span className="font-bold">"delete my account"</span> in the box
            below:
          </p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
