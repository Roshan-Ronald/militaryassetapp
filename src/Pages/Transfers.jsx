import React, { useState, useEffect } from "react";
import { FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {  getTransfers,  createTransfer,} from '../Api';

const baseOptions = ["Base Alpha", "Bravo", "Charlie"];
const PAGE_SIZE = 10;

const assetOptionsSelect = [
  "vhvh (Weapon) - Available: 900",
  "A16 (Weapon) - Available: 2",
  "M4 Rifle (Weapon) - Available: 100",
  "5.56mm Ammunition (Ammunition) - Available: 9000",
  "Humvee (Vehicle) - Available: 20"
];

export default function TransferManager() {
  const [transfers, setTransfers] = useState([]);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterBase, setFilterBase] = useState("All");
  const [filterSearch, setFilterSearch] = useState("");
  const [formData, setFormData] = useState({
    asset: "",
    fromBase: "",
    toBase: "",
    quantity: 1,
    notes: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      const data = await getTransfers();
      setTransfers(data.length ? data : [
        { asset: "vhvh", type: "Weapon", from: "Charlie", to: "Alpha", quantity: 1, status: "Completed", date: "Aug 17, 2025" },
        { asset: "5.56mm Ammunition", type: "Ammunition", from: "Bravo", to: "Charlie", quantity: 1, status: "Completed", date: "Aug 15, 2025" },
        { asset: "A16", type: "Weapon", from: "Alpha", to: "Charlie", quantity: 1, status: "Completed", date: "Aug 15, 2025" },
        { asset: "M4 Rifle", type: "Weapon", from: "Alpha", to: "Bravo", quantity: 10, status: "Completed", date: "May 10, 2025" }
      ]);
    }
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("transfersData", JSON.stringify(transfers));
  }, [transfers]);

  const filteredTransfers = transfers.filter(tr =>
    (filterBase === "All" || tr.from === filterBase || tr.to === filterBase) &&
    (tr.asset.toLowerCase().includes(filterSearch.toLowerCase()) || tr.type.toLowerCase().includes(filterSearch.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredTransfers.length / PAGE_SIZE));
  const pagedTransfers = filteredTransfers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.asset) e.asset = "Asset required";
    if (!formData.fromBase) e.fromBase = "From base required";
    if (!formData.toBase) e.toBase = "To base required";
    if (!formData.quantity || Number(formData.quantity) < 1) e.quantity = "Quantity must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const parseAssetName = (str) => str.split(" (")[0];
  const parseAssetType = (str) => {
    const m = str.match(/\(([^)]+)\)/);
    return m ? m[1] : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newTransfer = {
      id: Date.now(),
      asset: parseAssetName(formData.asset),
      type: parseAssetType(formData.asset),
      from: formData.fromBase,
      to: formData.toBase,
      quantity: Number(formData.quantity),
      status: "Completed",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      notes: formData.notes.trim()
    };
    await createTransfer(newTransfer);
    const updated = await getTransfers();
    setTransfers(updated);
    setPage(1);
    setFormData({ asset: "", fromBase: "", toBase: "", quantity: 1, notes: "" });
    setErrors({});
    setShowForm(false);
  };

  return (
    <div className="max-w-[1100px] mx-auto p-4 sm:p-6">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold min-w-[200px] flex-grow text-slate-900">Transfers</h1>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 ${showFilters ? "ring-2 ring-blue-300" : ""}`}>
            <FunnelIcon className="w-5 h-5" /> Filters
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700 transition">
            <PlusIcon className="w-4 h-4" /> New
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded shadow p-6 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="filterBase" className="block mb-1 text-sm font-semibold text-gray-700">Base</label>
            <select id="filterBase" className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filterBase} onChange={e => { setFilterBase(e.target.value); setPage(1); }}>
              <option value="All">All</option>
              {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filterSearch" className="block mb-1 text-sm font-semibold text-gray-700">Search</label>
            <input id="filterSearch" type="text" placeholder="Search asset/type" value={filterSearch} onChange={e => { setFilterSearch(e.target.value); setPage(1); }} className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2 flex space-x-3 justify-end">
            <button onClick={() => { setFilterBase("All"); setFilterSearch(""); setPage(1); }} className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">Reset</button>
            <button onClick={() => setShowFilters(false)} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Apply</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded shadow p-6 max-w-lg mx-auto mb-10">
          <button onClick={() => setShowForm(false)} className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h2 className="text-2xl font-bold mb-6">New Transfer</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Asset</label>
              <select name="asset" value={formData.asset} onChange={handleInputChange} required className={`w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.asset ? 'border-red-600' : ''}`}>
                <option value="">Select asset</option>
                {assetOptionsSelect.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
              {errors.asset && <p className="text-red-600 text-sm mt-1">{errors.asset}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-800">From Base</label>
                <select name="fromBase" value={formData.fromBase} onChange={handleInputChange} required className={`w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.fromBase ? 'border-red-600' : ''}`}>
                  <option value="">Select base</option>
                  {baseOptions.map((b, i) => <option key={i} value={b}>{b}</option>)}
                </select>
                {errors.fromBase && <p className="text-red-600 text-sm mt-1">{errors.fromBase}</p>}
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-800">To Base</label>
                <select name="toBase" value={formData.toBase} onChange={handleInputChange} required className={`w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.toBase ? 'border-red-600' : ''}`}>
                  <option value="">Select base</option>
                  {baseOptions.map((b, i) => <option key={i} value={b}>{b}</option>)}
                </select>
                {errors.toBase && <p className="text-red-600 text-sm mt-1">{errors.toBase}</p>}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" required className={`w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.quantity ? 'border-red-600' : ''}`} />
              {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-800">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setShowForm(false)} className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-auto rounded shadow border border-gray-300 bg-white">
        <table className="min-w-full border-collapse text-sm text-left font-sans">
          <thead className="bg-gray-100 text-gray-800 font-semibold uppercase text-xs">
            <tr>
              <th className="px-4 py-3 border border-gray-300">Asset</th>
              <th className="px-4 py-3 border border-gray-300">Type</th>
              <th className="px-4 py-3 border border-gray-300">From</th>
              <th className="px-4 py-3 border border-gray-300">To</th>
              <th className="px-4 py-3 border border-gray-300">Quantity</th>
              <th className="px-4 py-3 border border-gray-300">Status</th>
              <th className="px-4 py-3 border border-gray-300">Date</th>
              <th className="px-4 py-3 border border-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedTransfers.length === 0 ? (
              <tr><td colSpan={8} className="text-center p-4 text-gray-500">No transfers found.</td></tr>
            ) : pagedTransfers.map((tr, i) => (
              <tr key={i} className={`${i % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-blue-50`}>
                <td className="px-2 sm:px-3 py-3 sm:py-4 font-semibold text-blue-600 cursor-pointer">{tr.asset}</td>
                <td className="px-2 sm:px-3 py-3 sm:py-4 ">{tr.type}</td>
                <td className="px-2 sm:px-3 py-3 sm:py-4 ">{tr.from}</td>
                <td className="px-2 sm:px-3 py-3 sm:py-4 ">{tr.to}</td>
                <td className="px-2 sm:px-3 py-3 sm:py-4 ">{tr.quantity}</td>
                <td className="px-2 sm:px-3 py-3 sm:py-4 ">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold">{tr.status}</span>
                </td>
                <td className="px-2 sm:px-3 py-3 sm:py-4 ">{tr.date}</td>
                <td className="px-2 sm:px-3 py-3 sm:py-4 text-right">
                  <button onClick={() => alert(`View transfer: ${tr.asset}`)} className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-between items-center p-4 text-sm">
        <div>Showing {pagedTransfers.length ? (page - 1) * PAGE_SIZE + 1 : 0} to {Math.min(page * PAGE_SIZE, filteredTransfers.length)} of {filteredTransfers.length} results</div>
        <nav className="inline-flex space-x-1">
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50">{'<'}</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'} rounded border border-gray-300 px-3 py-1 hover:bg-gray-100`}>{i + 1}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 disabled:opacity-50">{'>'}</button>
        </nav>
      </div>
    </div>
  );
}
