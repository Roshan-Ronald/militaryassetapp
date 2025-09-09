import React, { useState, useEffect } from "react";
import { FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getAssets, getAssetById, createAsset, updateAsset, deleteAsset } from "../Api";

const PAGE_SIZE = 10;
const baseOptions = ["Base Alpha", "Base Bravo", "Base Charlie", "Base Delta", "Base Echo"];
const typeOptions = ["Vehicle", "Weapon", "Ammunition", "Equipment", "Other"];

const AssetFilterModal = ({ show, onClose, base, setBase, type, setType, search, setSearch, onReset, onApply }) => {
  if (!show) return null;
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col gap-6 w-full max-w-full md:max-w-6xl mx-auto relative">
      <button aria-label="Close" onClick={onClose} className="absolute top-4 right-4 text-gray-700 hover:text-gray-900">
        ✕
      </button>
      <h2 className="text-xl font-bold tracking-tight">Filters</h2>
      <form className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-1">Base</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2" value={base} onChange={e => setBase(e.target.value)}>
            <option>All Bases</option>
            {baseOptions.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-1">Asset Type</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2" value={type} onChange={e => setType(e.target.value)}>
            <option>All Types</option>
            {typeOptions.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-1">Search</label>
          <input type="text" placeholder="Search by name" className="border border-gray-300 rounded-lg px-3 py-2" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </form>
      <div className="flex flex-col sm:flex-row justify-end gap-4 w-full">
        <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 w-full sm:w-auto" onClick={onReset}>Reset</button>
        <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 w-full sm:w-auto" onClick={onApply}>Apply Filters</button>
      </div>
    </div>
  );
};

const AssetFormPage = ({ show, onClose, onSubmit, errorState, assetForm, setAssetForm }) => {
  if (!show) return null;
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-lg w-full border border-gray-300">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button onClick={onClose} className="text-blue-700 hover:text-blue-900">←</button>
          <h1 className="text-xl sm:text-2xl font-bold">{assetForm.id ? "Edit Asset" : "Create New Asset"}</h1>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Asset Name</label>
            <input type="text" placeholder="Enter asset name" value={assetForm.name} onChange={e => setAssetForm({ ...assetForm, name: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 ${errorState.name ? "border-red-600" : "border-gray-300"} focus:border-blue-600`} />
            {errorState.name && <p className="text-red-600 text-sm mt-1">{errorState.name}</p>}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Asset Type</label>
            <select value={assetForm.type} onChange={e => setAssetForm({ ...assetForm, type: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 ${errorState.type ? "border-red-600" : "border-gray-300"} focus:border-blue-600`}>
              <option value="">Select Type</option>
              {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errorState.type && <p className="text-red-600 text-sm mt-1">{errorState.type}</p>}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Base</label>
            <select value={assetForm.base} onChange={e => setAssetForm({ ...assetForm, base: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 ${errorState.base ? "border-red-600" : "border-gray-300"} focus:border-blue-600`}>
              <option value="">Select Base</option>
              {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {errorState.base && <p className="text-red-600 text-sm mt-1">{errorState.base}</p>}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Opening Balance</label>
            <input type="number" min="0" value={assetForm.available} onChange={e => setAssetForm({ ...assetForm, available: e.target.value })}
              className={`w-full rounded-lg border px-4 py-3 ${errorState.available ? "border-red-600" : "border-gray-300"} focus:border-blue-600`} />
            {errorState.available && <p className="text-red-600 text-sm mt-1">{errorState.available}</p>}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="bg-white text-gray-700 border-2 border-gray-400 rounded-lg px-6 py-3 font-semibold hover:bg-gray-100 transition w-full sm:w-auto">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-8 py-3 font-bold shadow-lg hover:bg-blue-700 transition w-full sm:w-auto">{assetForm.id ? "Update Asset" : "Create Asset"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssetManager = () => {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [showFormPage, setShowFormPage] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, name: "", type: "", base: "", available: 0 });
  const [errorState, setErrorState] = useState({});
  const [baseFilter, setBaseFilter] = useState("All Bases");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchFilter, setSearchFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ base: "All Bases", type: "All Types", search: "" });

  useEffect(() => {
    const fetchData = async () => {
      let data = await getAssets();
      if (appliedFilters.base !== "All Bases") data = data.filter(a => a.base === appliedFilters.base);
      if (appliedFilters.type !== "All Types") data = data.filter(a => a.type === appliedFilters.type);
      if (appliedFilters.search.trim() !== "") data = data.filter(a => a.name.toLowerCase().includes(appliedFilters.search.toLowerCase()));
      setAssets(data);
      setPage(1);
    };
    fetchData();
  }, [appliedFilters]);

  const validateForm = () => {
    const errors = {};
    if (!editForm.name.trim()) errors.name = "Name is required";
    if (!editForm.type.trim()) errors.type = "Type is required";
    if (!editForm.base.trim()) errors.base = "Base is required";
    if (editForm.available === "" || isNaN(editForm.available) || Number(editForm.available) < 0) errors.available = "Enter a valid non-negative number";
    setErrorState(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddForm = () => {
    setEditForm({ id: null, name: "", type: "", base: "", available: 0 });
    setErrorState({});
    setShowFormPage(true);
  };

  const openEditForm = (asset) => {
    setEditForm(asset);
    setErrorState({});
    setShowFormPage(true);
  };

  const closeForm = () => {
    setShowFormPage(false);
    setEditForm({ id: null, name: "", type: "", base: "", available: 0 });
    setErrorState({});
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editForm.id) {
      await updateAsset(editForm.id, { ...editForm, available: Number(editForm.available), status: Number(editForm.available) > 0 ? "Sufficient" : "Insufficient" });
    } else {
      await createAsset({ ...editForm, id: Date.now(), available: Number(editForm.available), assigned: 0, status: Number(editForm.available) > 0 ? "Sufficient" : "Insufficient" });
    }
    const data = await getAssets();
    setAssets(data);
    closeForm();
  };

  const removeAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    await deleteAsset(id);
    const data = await getAssets();
    setAssets(data);
  };

  const handleResetFilters = () => {
    setBaseFilter("All Bases");
    setTypeFilter("All Types");
    setSearchFilter("");
    setAppliedFilters({ base: "All Bases", type: "All Types", search: "" });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ base: baseFilter, type: typeFilter, search: searchFilter.trim() });
    setShowFilter(false);
  };

  const pagedAssets = assets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-full sm:max-w-7xl mx-auto mt-6 px-2 sm:px-4 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#181C32]">Assets</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setShowFilter(v => !v)} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold border border-[#CBD2E0] bg-white hover:bg-gray-50">
            <FunnelIcon className="w-5 h-5" /> Filters
          </button>
          <button onClick={openAddForm} className="flex items-center gap-1 bg-[#198CF7] text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg font-bold shadow-sm hover:bg-[#136BFE]">
            <PlusIcon className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      <AssetFilterModal show={showFilter} onClose={() => setShowFilter(false)} base={baseFilter} setBase={setBaseFilter} type={typeFilter} setType={setTypeFilter} search={searchFilter} setSearch={setSearchFilter} onReset={handleResetFilters} onApply={handleApplyFilters} />

      <AssetFormPage show={showFormPage} onClose={closeForm} onSubmit={submitForm} errorState={errorState} assetForm={editForm} setAssetForm={setEditForm} />

      <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm text-[#182233]">
          <thead>
            <tr className="bg-[#FAFAFB] text-[#181C32] font-bold border-b border-gray-300 text-xs sm:text-sm">
              <th className="px-2 sm:px-3 py-3 sm:py-4">NAME</th>
              <th className="px-2 sm:px-3 py-3 sm:py-4">TYPE</th>
              <th className="px-2 sm:px-3 py-3 sm:py-4">BASE</th>
              <th className="px-2 sm:px-3 py-3 sm:py-4">AVAILABLE</th>
              <th className="px-2 sm:px-3 py-3 sm:py-4">ASSIGNED</th>
              <th className="px-2 sm:px-3 py-3 sm:py-4">STATUS</th>
              <th className="px-2 sm:px-3 py-3 sm:py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pagedAssets.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No assets found</td>
              </tr>
            ) : (
              pagedAssets.map(asset => (
                <tr key={asset.id} className="even:bg-gray-50 hover:bg-blue-50 text-xs sm:text-sm">
                  <td className="px-2 sm:px-3 py-3 sm:py-4 text-blue-600 font-semibold underline cursor-pointer">{asset.name}</td>
                  <td className="px-2 sm:px-3 py-3 sm:py-4">{asset.type}</td>
                  <td className="px-2 sm:px-3 py-3 sm:py-4">{asset.base}</td>
                  <td className="px-2 sm:px-3 py-3 sm:py-4">{asset.available}</td>
                  <td className="px-2 sm:px-3 py-3 sm:py-4">{asset.assigned ?? 0}</td>
                  <td className="px-2 sm:px-3 py-3 sm:py-4">{asset.status}</td>
                  <td className="px-2 sm:px-3 py-3 sm:py-4 text-right">
                    <div className="flex gap-2 sm:gap-4 justify-end flex-wrap">
                      <button onClick={() => alert(`View ${asset.name}`)} className="text-blue-600 font-semibold text-xs sm:text-sm hover:underline">View</button>
                      <button onClick={() => openEditForm(asset)} className="text-blue-800 font-semibold text-xs sm:text-sm hover:underline">Edit</button>
                      <button onClick={() => removeAsset(asset.id)} className="text-red-600 font-semibold text-xs sm:text-sm hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {assets.length > PAGE_SIZE && (
        <div className="flex justify-center items-center mt-4 gap-3 text-sm sm:text-base">
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 sm:px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Prev</button>
          <span>Page {page} of {Math.ceil(assets.length / PAGE_SIZE)}</span>
          <button disabled={page === Math.ceil(assets.length / PAGE_SIZE)} onClick={() => setPage(p => Math.min(Math.ceil(assets.length / PAGE_SIZE), p + 1))} className="px-3 sm:px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default AssetManager;
