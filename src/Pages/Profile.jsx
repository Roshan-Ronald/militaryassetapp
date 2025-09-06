import React, { useState } from "react";

export default function UserProfile() {
  const [accountStatus, setAccountStatus] = useState("Active");
  const [page, setPage] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleStatus = () => {
    setAccountStatus((prev) => (prev === "Active" ? "Deactive" : "Active"));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-gray-50 to-blue-50 p-8 md:p-12 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900 drop-shadow-md">
            User Profile
          </h1>
          <nav className="inline-flex rounded-lg bg-white shadow-lg overflow-hidden">
            <button
              onClick={() => setPage("profile")}
              className={`px-7 py-3 font-semibold transition-colors duration-300 rounded-l-lg focus:outline-none ${
                page === "profile"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setPage("changePassword")}
              className={`px-7 py-3 font-semibold transition-colors duration-300 rounded-r-lg focus:outline-none ${
                page === "changePassword"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              Change Password
            </button>
          </nav>
        </header>

        {page === "profile" && (
          <section className="bg-white rounded-3xl p-10 shadow-xl ring-1 ring-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-wide">
              User Information
            </h2>
            <p className="text-gray-600 mb-10 max-w-xl">
              View and manage your personal details and application settings.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-gray-800">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Full Name</dt>
                <dd className="text-lg font-semibold">Roshan Ronald</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Username</dt>
                <dd className="text-lg font-semibold">roshanronald</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Email Address</dt>
                <dd className="text-lg font-semibold break-words">roshanronald@gmail.com</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Role</dt>
                <dd>
                  <span className="inline-block bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-md">
                    Admin
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Account Status</dt>
                <dd className="flex items-center space-x-6">
                  <span
                    className={`text-sm font-semibold px-5 py-2 rounded-full shadow-sm ${
                      accountStatus === "Active"
                        ? "bg-green-100 text-green-800 shadow-green-200"
                        : "bg-red-100 text-red-800 shadow-red-200"
                    }`}
                  >
                    {accountStatus}
                  </span>
                  <button
                    onClick={toggleStatus}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  >
                    {accountStatus === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </dd>
              </div>
            </dl>
          </section>
        )}

        {page === "changePassword" && (
          <section className="bg-white rounded-3xl p-10 shadow-xl ring-1 ring-gray-200 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-gray-900 tracking-wide text-center">
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-8">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block mb-2 text-gray-700 font-semibold"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-5 py-3 text-lg rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-gray-700 font-semibold"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3 text-lg rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-gray-700 font-semibold"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3 text-lg rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-extrabold rounded-3xl py-4 shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
              >
                Change Password
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
