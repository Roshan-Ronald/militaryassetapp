import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser } from '../Api';
import { FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ROLE_OPTIONS = ['All Roles', 'Admin', 'Base Commander', 'Logistics Officer'];
const BASE_OPTIONS = ['All Bases', 'N/A', 'Base Alpha', 'Base Bravo'];
const STATUS_OPTIONS = ['All Statuses', 'Active', 'Inactive'];

const ROLE_BADGES = {
  Admin: 'bg-purple-100 text-purple-700',
  'Base Commander': 'bg-blue-100 text-blue-700',
  'Logistics Officer': 'bg-green-100 text-green-700',
};

const STATUS_BADGES = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({
    role: 'All Roles',
    base: 'All Bases',
    status: 'All Statuses',
    search: '',
  });
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showFilter, setShowFilter] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
    base: '',
    status: '',
  });
  const [editErrors, setEditErrors] = useState({});
  const [addForm, setAddForm] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    role: 'Logistics Officer',
    base: '',
    status: 'Active',
  });
  const [addFormErr, setAddFormErr] = useState({});

  useEffect(() => {
    (async () => {
      const data = await getUsers();
      setUsers(data);
    })();
  }, []);

  const filtered = users.filter((user) => {
    if (filter.role !== 'All Roles' && user.role !== filter.role) return false;
    if (filter.base !== 'All Bases' && user.base !== filter.base) return false;
    if (filter.status !== 'All Statuses' && user.status !== filter.status)
      return false;
    if (filter.search.trim()) {
      const s = filter.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(s) ||
        user.username.toLowerCase().includes(s) ||
        user.email.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function validateEdit() {
    const e = {};
    if (!editForm.name.trim()) e.name = 'Name required';
    if (!editForm.username.trim()) e.username = 'Username required';
    if (!editForm.email.trim()) e.email = 'Email required';
    if (!editForm.role.trim()) e.role = 'Role required';
    if (!editForm.base.trim()) e.base = 'Base required';
    if (!editForm.status.trim()) e.status = 'Status required';
    setEditErrors(e);
    return Object.keys(e).length === 0;
  }

  async function saveEdit() {
    if (!validateEdit()) return;
    try {
      await updateUser(editForm.username, editForm);
      const updated = await getUsers();
      setUsers(updated);
      setEditIndex(null);
      setEditErrors({});
    } catch (error) {
      alert(error.message);
    }
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditErrors({});
  }

  function startEdit(idx) {
    setEditIndex(idx);
    setEditForm({ ...users[idx] });
  }

  async function toggleStatus(idx) {
    const user = users[idx];
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateUser(user.username, { status: newStatus });
      const updated = await getUsers();
      setUsers(updated);
    } catch (error) {
      alert(error.message);
    }
  }

  function validateAdd(form) {
    const e = {};
    if (!form.username.trim()) e.username = 'Username required';
    if (!form.password.trim()) e.password = 'Password required';
    if (!form.email.trim()) e.email = 'Email required';
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.base.trim()) e.base = 'Base required';
    setAddFormErr(e);
    return Object.keys(e).length === 0;
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    if (!validateAdd(addForm)) return;
    try {
      await createUser({
        username: addForm.username,
        email: addForm.email,
        name: addForm.name,
        role: addForm.role,
        base: addForm.base,
        status: 'Active',
      });
      const updated = await getUsers();
      setUsers(updated);
      setShowAdd(false);
      setAddForm({
        username: '',
        password: '',
        email: '',
        name: '',
        role: 'Logistics Officer',
        base: '',
        status: 'Active',
      });
      setAddFormErr({});
      setPage(1);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto font-sans">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-1 px-4 py-2 border rounded ${
              showFilter
                ? 'border-blue-600 ring-2 ring-blue-300'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowAdd(true)}
          >
            <PlusIcon className="w-5 h-5" />
            New User
          </button>
        </div>
      </div>

      {showFilter && (
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded shadow">
          <div>
            <label
              htmlFor="filterRole"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Role
            </label>
            <select
              id="filterRole"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filter.role}
              onChange={(e) =>
                setFilter((f) => ({ ...f, role: e.target.value }))
              }
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filterBase"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Base
            </label>
            <select
              id="filterBase"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filter.base}
              onChange={(e) =>
                setFilter((f) => ({ ...f, base: e.target.value }))
              }
            >
              {BASE_OPTIONS.map((base) => (
                <option key={base}>{base}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filterStatus"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Status
            </label>
            <select
              id="filterStatus"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filter.status}
              onChange={(e) =>
                setFilter((f) => ({ ...f, status: e.target.value }))
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filterSearch"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Search
            </label>
            <input
              id="filterSearch"
              type="text"
              placeholder="Search by name, username, or email"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              value={filter.search}
              onChange={(e) =>
                setFilter((f) => ({ ...f, search: e.target.value }))
              }
            />
          </div>
          <div className="col-span-4 flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="px-6 py-2 border rounded hover:bg-gray-100"
              onClick={() =>
                setFilter({
                  role: 'All Roles',
                  base: 'All Bases',
                  status: 'All Statuses',
                  search: '',
                })
              }
            >
              Reset
            </button>
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowFilter(false)}
            >
              Apply
            </button>
          </div>
        </form>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowAdd(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">New User</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                className={`w-full p-2 border rounded ${
                  addFormErr.username ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="Username"
                value={addForm.username}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, username: e.target.value }))
                }
              />
              <input
                type="password"
                className={`w-full p-2 border rounded ${
                  addFormErr.password ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="Password"
                value={addForm.password}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, password: e.target.value }))
                }
              />
              <input
                type="email"
                className={`w-full p-2 border rounded ${
                  addFormErr.email ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="Email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <input
                className={`w-full p-2 border rounded ${
                  addFormErr.name ? 'border-red-600' : 'border-gray-300'
                }`}
                placeholder="Full Name"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={addForm.role}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                {ROLE_OPTIONS.filter((o) => o !== 'All Roles').map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                className={`w-full p-2 border rounded ${
                  addFormErr.base ? 'border-red-600' : 'border-gray-300'
                }`}
                value={addForm.base}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, base: e.target.value }))
                }
              >
                <option value="">Select Base</option>
                {BASE_OPTIONS.filter((o) => o !== 'All Bases').map((base) => (
                  <option key={base} value={base}>
                    {base}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-auto rounded border border-gray-300 bg-white">
        <table className="w-full text-sm table-fixed border-collapse font-sans text-gray-900">
          <thead className="bg-gray-100 font-semibold uppercase text-xs">
            <tr>
              <th className="w-1/5 p-2 border border-gray-300">Name</th>
              <th className="w-1/6 p-2 border border-gray-300">Username</th>
              <th className="w-1/5 p-2 border border-gray-300">Email</th>
              <th className="w-1/6 p-2 border border-gray-300">Role</th>
              <th className="w-1/6 p-2 border border-gray-300">Base</th>
              <th className="w-1/12 p-2 border border-gray-300">Status</th>
              <th className="w-1/12 p-2 border border-gray-300 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              paged.map((user, idx) => {
                const overallIndex = (page - 1) * perPage + idx;
                return (
                  <tr
                    key={user.username || idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {editIndex === overallIndex ? (
                      <>
                        <td className="p-2 border border-gray-300">
                          <input
                            className={`w-full p-1 border rounded ${
                              editErrors.name ? 'border-red-600' : 'border-gray-300'
                            }`}
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            className={`w-full p-1 border rounded ${
                              editErrors.username ? 'border-red-600' : 'border-gray-300'
                            }`}
                            value={editForm.username}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <input
                            className={`w-full p-1 border rounded ${
                              editErrors.email ? 'border-red-600' : 'border-gray-300'
                            }`}
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="p-2 border border-gray-300">
                          <select
                            className={`w-full p-1 border rounded ${
                              editErrors.role ? 'border-red-600' : 'border-gray-300'
                            }`}
                            value={editForm.role}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                role: e.target.value,
                              }))
                            }
                          >
                            {ROLE_OPTIONS.filter((o) => o !== 'All Roles').map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <select
                            className={`w-full p-1 border rounded ${
                              editErrors.base ? 'border-red-600' : 'border-gray-300'
                            }`}
                            value={editForm.base}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                base: e.target.value,
                              }))
                            }
                          >
                            {BASE_OPTIONS.filter((o) => o !== 'All Bases').map((base) => (
                              <option key={base} value={base}>
                                {base}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 border border-gray-300">
                          <select
                            className={`w-full p-1 border rounded ${
                              editErrors.status ? 'border-red-600' : 'border-gray-300'
                            }`}
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                status: e.target.value,
                              }))
                            }
                          >
                            {STATUS_OPTIONS.filter((o) => o !== 'All Statuses').map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 border border-gray-300 text-right space-x-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={saveEdit}
                            type="button"
                          >
                            Save
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={cancelEdit}
                            type="button"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 sm:px-3 py-3 sm:py-4  font-semibold">
                          {user.name}
                        </td>
                        <td className="px-2 sm:px-3 py-3 sm:py-4 ">{user.username}</td>
                        <td className="px-2 sm:px-3 py-3 sm:py-4 ">{user.email}</td>
                        <td className="px-2 sm:px-3 py-3 sm:py-4 ">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              ROLE_BADGES[user.role] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 py-3 sm:py-4 ">{user.base}</td>
                        <td className="px-2 sm:px-3 py-3 sm:py-4 ">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              STATUS_BADGES[user.status] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 py-3 sm:py-4  text-right space-x-2">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => startEdit(overallIndex)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className={`${
                              user.status === 'Active'
                                ? 'text-red-600'
                                : 'text-green-600'
                            } hover:underline`}
                            onClick={() => toggleStatus(overallIndex)}
                            type="button"
                          >
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <nav className="flex items-center justify-between p-3 text-sm">
          <div>
            {filtered.length > 0
              ? `Showing ${(page - 1) * perPage + 1} to ${Math.min(
                  page * perPage,
                  filtered.length
                )} of ${filtered.length} results`
              : 'No results'}
          </div>
          <div className="space-x-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded border px-3 py-1 disabled:opacity-50"
              type="button"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`${
                  page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'
                } rounded border px-3 py-1`}
                type="button"
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded border px-3 py-1 disabled:opacity-50"
              type="button"
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
