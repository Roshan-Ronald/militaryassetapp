import React, { useState } from "react";
import { FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ROLE_OPTIONS = ["All Roles", "Admin", "Base Commander", "Logistics Officer"];
const BASE_OPTIONS = ["All Bases", "N/A", "Base Alpha", "Bravo"];
const STATUS_OPTIONS = ["All Statuses", "Active", "Inactive"];
const ROLE_BADGES = {
  Admin: "bg-purple-100 text-purple-700",
  "Base Commander": "bg-blue-100 text-blue-700",
  "Logistics Officer": "bg-green-100 text-green-700",
};
const STATUS_BADGES = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
};
const INIT_USERS = [
  { name: "System Administrator", username: "admin", email: "admin@example.com", role: "Admin", base: "N/A", status: "Active" },
  { name: "Base Commander Alpha", username: "commander1", email: "commander1@example.com", role: "Base Commander", base: "Base Alpha", status: "Active" },
  { name: "Base Commander Bravo", username: "commander2", email: "commander2@example.com", role: "Base Commander", base: "Bravo", status: "Active" },
  { name: "Logistics Officer 1", username: "logistics1", email: "logistics1@example.com", role: "Logistics Officer", base: "Base Alpha", status: "Active" },
  { name: "Logistics Officer 2", username: "logistics2", email: "logistics2@example.com", role: "Admin", base: "Bravo", status: "Active" },
  { name: "System Administrator", username: "gangad", email: "gangad@gmail.com", role: "Admin", base: "N/A", status: "Active" },
  { name: "System Administrator", username: "dharan", email: "dharan@gmail.com", role: "Admin", base: "N/A", status: "Active" },
  { name: "ram", username: "ram", email: "ram@gmail.com", role: "Logistics Officer", base: "Base Alpha", status: "Active" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(INIT_USERS);
  const [filter, setFilter] = useState({ role: "All Roles", base: "All Bases", status: "All Statuses", search: "" });
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [showFilter, setShowFilter] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", username: "", email: "", role: "", base: "", status: "" });
  const [editErrors, setEditErrors] = useState({});

  const filtered = users.filter((user) => {
    if (filter.role !== "All Roles" && user.role !== filter.role) return false;
    if (filter.base !== "All Bases" && user.base !== filter.base) return false;
    if (filter.status !== "All Statuses" && user.status !== filter.status) return false;
    if (filter.search.trim()) {
      const search = filter.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  function validateEdit() {
    const err = {};
    if (!editForm.name.trim()) err.name = "Name required";
    if (!editForm.username.trim()) err.username = "Username required";
    if (!editForm.email.trim()) err.email = "Email required";
    if (!editForm.role.trim()) err.role = "Role required";
    if (!editForm.base.trim()) err.base = "Base required";
    if (!editForm.status.trim()) err.status = "Status required";
    setEditErrors(err);
    return Object.keys(err).length === 0;
  }

  function saveEdit() {
    if (!validateEdit()) return;
    const updated = [...users];
    updated[editIndex] = { ...editForm };
    setUsers(updated);
    setEditIndex(null);
    setEditErrors({});
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditErrors({});
  }

  function startEdit(idx) {
    setEditIndex(idx);
    setEditForm({ ...users[idx] });
  }

  function toggleStatus(idx) {
    const updated = [...users];
    updated[idx].status = updated[idx].status === "Active" ? "Inactive" : "Active";
    setUsers(updated);
  }

  function validateAdd(form) {
    const err = {};
    if (!form.username.trim()) err.username = "Username required";
    if (!form.password.trim()) err.password = "Password required";
    if (!form.email.trim()) err.email = "Email required";
    if (!form.name.trim()) err.name = "Name required";
    if (!form.base.trim()) err.base = "Base required";
    return err;
  }

  const [addForm, setAddForm] = useState({
    username: "", password: "", email: "", name: "",
    role: "Logistics Officer", base: "", status: "Active"
  });
  const [addFormErr, setAddFormErr] = useState({});

  function handleAddSubmit(e) {
    e.preventDefault();
    const errors = validateAdd(addForm);
    if (Object.keys(errors).length > 0) {
      setAddFormErr(errors);
      return;
    }
    setUsers([{ name: addForm.name, username: addForm.username, email: addForm.email, role: addForm.role, base: addForm.base, status: "Active" }, ...users]);
    setShowAdd(false);
    setAddForm({ username: "", password: "", email: "", name: "", role: "Logistics Officer", base: "", status: "Active" });
    setAddFormErr({});
    setPage(1);
  }

  return (
    <div className=" min-h-screen p-8 font-sans max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowFilter(!showFilter)} className={`flex items-center cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg border ${showFilter ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"} hover:bg-gray-50 focus:outline-none`}>
            <FunnelIcon className="w-5 h-5 mr-1" /> Filters
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center px-5 py-2 text-white bg-blue-600 rounded-lg font-bold hover:bg-blue-700">
            <PlusIcon className="w-5 h-5 mr-1" /> New User
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Role</label>
            <select className="w-full border rounded px-3 py-2" value={filter.role} onChange={e => setFilter(f => ({ ...f, role: e.target.value }))}>
              {ROLE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Base</label>
            <select className="w-full border rounded px-3 py-2" value={filter.base} onChange={e => setFilter(f => ({ ...f, base: e.target.value }))}>
              {BASE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Status</label>
            <select className="w-full border rounded px-3 py-2" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
              {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Search</label>
            <input type="text" placeholder="Search by name, username, or email" className="w-full border rounded px-3 py-2" value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
          </div>
          <div className="col-span-4 flex justify-end space-x-4">
            <button onClick={() => setFilter({ role: "All Roles", base: "All Bases", status: "All Statuses", search: "" })} className="px-6 py-2 border rounded hover:bg-gray-100 font-semibold">Reset</button>
            <button onClick={() => setShowFilter(false)} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Apply</button>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative">
            <button onClick={() => setShowAdd(false)} className="absolute top-5 right-6 text-gray-400 hover:text-gray-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Create New User</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input className={`w-full px-4 py-3 border rounded ${addFormErr.username ? "border-red-600" : "border-gray-300"}`} placeholder="Username" value={addForm.username} onChange={e => setAddForm(f => ({ ...f, username: e.target.value }))} />
              <input className={`w-full px-4 py-3 border rounded ${addFormErr.password ? "border-red-600" : "border-gray-300"}`} placeholder="Password" type="password" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} />
              <input className={`w-full px-4 py-3 border rounded ${addFormErr.email ? "border-red-600" : "border-gray-300"}`} placeholder="Email" type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
              <input className={`w-full px-4 py-3 border rounded ${addFormErr.name ? "border-red-600" : "border-gray-300"}`} placeholder="Full Name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} />
              <select className="w-full px-4 py-3 border rounded cursor-pointer" value={addForm.role} onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}>
                {ROLE_OPTIONS.filter(o => o !== "All Roles").map(o => <option key={o}>{o}</option>)}
              </select>
              <select className={`w-full px-4 py-3 border rounded cursor-pointer ${addFormErr.base ? "border-red-600" : "border-gray-300"}`} value={addForm.base} onChange={e => setAddForm(f => ({ ...f, base: e.target.value }))}>
                <option value="">Select a base</option>
                {BASE_OPTIONS.filter(o => o !== "All Bases").map(o => <option key={o}>{o}</option>)}
              </select>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-2 border rounded hover:bg-gray-100 font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse min-w-[650px] text-left text-[13px] text-[#182233]">
          <thead>
            <tr className="bg-[#FAFAFB] text-[#181C32] font-bold border-b border-gray-300">
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">NAME ↑</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">USERNAME</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">EMAIL</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">ROLE</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">BASE</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">STATUS</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">No users found.</td>
              </tr>
            ) : (
              paged.map((user, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {editIndex === (page - 1) * perPage + i ? (
                    <>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <input className={`w-full px-3 py-1 border rounded ${editErrors.name ? "border-red-600" : "border-gray-300"}`} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <input className={`w-full px-3 py-1 border rounded ${editErrors.username ? "border-red-600" : "border-gray-300"}`} value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} />
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <input className={`w-full px-3 py-1 border rounded ${editErrors.email ? "border-red-600" : "border-gray-300"}`} value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <select className={`w-full px-3 py-1 border rounded cursor-pointer ${editErrors.role ? "border-red-600" : "border-gray-300"}`} value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                          {ROLE_OPTIONS.filter(o => o !== "All Roles").map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <select className={`w-full px-3 py-1 border rounded cursor-pointer ${editErrors.base ? "border-red-600" : "border-gray-300"}`} value={editForm.base} onChange={e => setEditForm({ ...editForm, base: e.target.value })}>
                          {BASE_OPTIONS.filter(o => o !== "All Bases").map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <select className={`w-full px-3 py-1 border rounded cursor-pointer ${editErrors.status ? "border-red-600" : "border-gray-300"}`} value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                          {STATUS_OPTIONS.filter(o => o !== "All Statuses").map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300 flex gap-2">
                        <button onClick={saveEdit} className="text-blue-600 hover:underline font-semibold text-sm">Save</button>
                        <button onClick={cancelEdit} className="text-red-600 hover:underline font-semibold text-sm">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-4 border-r border-gray-300 font-semibold">{user.name}</td>
                      <td className="px-3 py-4 border-r border-gray-300 text-gray-600">{user.username}</td>
                      <td className="px-3 py-4 border-r border-gray-300 text-gray-600">{user.email}</td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${ROLE_BADGES[user.role] || "bg-gray-100 text-gray-700"}`}>{user.role}</span>
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300">{user.base}</td>
                      <td className="px-3 py-4 border-r border-gray-300">
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${STATUS_BADGES[user.status] || "bg-gray-100 text-gray-700"}`}>{user.status}</span>
                      </td>
                      <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">
                        <button onClick={() => startEdit((page - 1) * perPage + i)} className="text-blue-600 hover:underline font-semibold text-sm mr-3 cursor-pointer">Edit</button>
                        <button onClick={() => toggleStatus((page - 1) * perPage + i)} className={`font-semibold text-sm cursor-pointer hover:underline ${user.status === "Active" ? "text-red-600" : "text-green-700"}`}>
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex flex-wrap justify-between items-center px-5 py-3 gap-3">
          <span className="text-sm text-gray-700">Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} results</span>
          <div className="flex items-center gap-2">
            <select className="border border-gray-300 rounded px-2 py-1 text-sm" value={perPage} readOnly>
              <option>{perPage} per page</option>
            </select>
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 rounded border border-gray-300 text-gray-900 hover:bg-gray-100 disabled:opacity-50">&lt;</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded border text-sm font-bold ${page === i + 1 ? "bg-blue-600 border-blue-600 text-white" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border border-gray-300 text-gray-900 hover:bg-gray-100 disabled:opacity-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
