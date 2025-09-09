import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../Api";
import { FunnelIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function UserProfile() {
  const [accountStatus, setAccountStatus] = useState("Active");
  const [page, setPage] = useState("profile");
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    email: "",
    role: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const data = await getUserProfile();
      setProfile({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        role: data.role,
      });
      setAccountStatus(data.accountStatus || "Active");
    }
    fetchProfile();
  }, []);

  const toggleStatus = async () => {
    const newStatus = accountStatus === "Active" ? "Deactive" : "Active";
    setAccountStatus(newStatus);
    await updateUserProfile({ ...profile, accountStatus: newStatus });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    alert("Password change functionality is not implemented.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-gray-50 to-blue-50 p-4 sm:p-8 lg:p-12 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 drop-shadow-md">
            User Profile
          </h1>
          <nav className="inline-flex bg-white shadow rounded-lg overflow-hidden">
            <button
              className={`w-full sm:w-auto px-6 py-3 font-semibold tracking-wide transition-colors duration-300 focus:outline-none ${
                page === "profile"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
              onClick={() => setPage("profile")}
            >
              Profile Information
            </button>
            <button
              className={`w-full sm:w-auto px-6 py-3 font-semibold tracking-wide transition-colors duration-300 focus:outline-none ${
                page === "changePassword"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
              onClick={() => setPage("changePassword")}
            >
              Change Password
            </button>
          </nav>
        </header>
        {page === "profile" && (
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl ring-1 ring-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 tracking-wide">
              User Information
            </h2>
            <p className="text-gray-600 mb-10 max-w-xl">
              View and manage your personal details and application settings.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-800">
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Full Name</dt>
                <dd className="text-lg font-semibold">{profile.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Username</dt>
                <dd className="text-lg font-semibold">{profile.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Email</dt>
                <dd className="text-lg font-semibold break-words">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Role</dt>
                <dd>
                  <span className="inline-block bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white px-4 py-1 rounded-full font-semibold text-sm shadow-md">
                    {profile.role}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-1">Account Status</dt>
                <dd className="flex items-center space-x-6">
                  <span
                    className={`inline-blockpx-5 py-2 rounded-full font-semibold shadow ${
                      accountStatus === "Active"
                        ? "bg-green-100 text-green-800 shadow-green-200"
                        : "bg-red-100 text-red-800 shadow-red-200"
                    }`}
                  >
                    {accountStatus}
                  </span>
                  <button
                    className="px-6 py-2 bg-blue-600 rounded-full font-semibold text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
                    onClick={toggleStatus}
                  >
                    {accountStatus === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </dd>
              </div>
            </dl>
          </section>
        )}
        {page === "changePassword" && (
          <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl ring-1 ring-gray-200 max-w-lg mx-auto mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-gray-700 mb-2 font-semibold">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-gray-700 mb-2 font-semibold">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2 font-semibold">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <button type="submit" className="w-full p-4 text-lg font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-400 transition">
                Change Password
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
