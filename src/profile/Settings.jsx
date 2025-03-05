// Settings.js
import React from "react";

const Settings = () => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Account Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and settings.
        </p>
      </div>

      <div className="px-6 py-5 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            Email Notifications
          </h4>
          <div className="mt-2 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="notifications-new-pets"
                  name="notifications-new-pets"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="notifications-new-pets"
                  className="font-medium text-gray-700"
                >
                  New pets that match my preferences
                </label>
                <p className="text-gray-500">
                  Get notified when new pets that match your preferences are
                  available for adoption.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="notifications-application-updates"
                  name="notifications-application-updates"
                  type="checkbox"
                  defaultChecked
                  className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="notifications-application-updates"
                  className="font-medium text-gray-700"
                >
                  Application status updates
                </label>
                <p className="text-gray-500">
                  Receive notifications when there are updates to your adoption
                  applications.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="notifications-newsletter"
                  name="notifications-newsletter"
                  type="checkbox"
                  className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="notifications-newsletter"
                  className="font-medium text-gray-700"
                >
                  Newsletter and updates
                </label>
                <p className="text-gray-500">
                  Receive our monthly newsletter with adoption success stories
                  and pet care tips.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Password</h4>
          <div className="mt-2">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Change Password
            </button>
          </div>
        </div>

        <div className="pt-5 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
          <p className="mt-1 text-sm text-gray-500">
            Once you delete your account, you will lose all data associated with
            it.
          </p>
          <div className="mt-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
