import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, PlusIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

const LOCAL_KEY = "assetsData";
const PAGE_SIZE = 10;

const baseOptions = ["Base Alpha", "Base Bravo", "Base Charlie", "Base Delta", "Base Echo"];
const typeOptions = ["Vehicle", "Weapon", "Ammunition", "Equipment", "Other"];

const defaultAssets = [
  { name: "5.56mm Ammunition", type: "Ammunition", base: "Base Alpha", available: 9000, assigned: 0, status: "Sufficient" },
  { name: "A16", type: "Weapon", base: "Base Charlie", available: 1, assigned: 0, status: "Sufficient" },
  { name: "A16", type: "Weapon", base: "Base Alpha", available: 1, assigned: 0, status: "Sufficient" },
  { name: "Humvee", type: "Vehicle", base: "Base Alpha", available: 20, assigned: 0, status: "Sufficient" },
  { name: "Humvee", type: "Vehicle", base: "Base Bravo", available: 15, assigned: 0, status: "Sufficient" },
  { name: "M4", type: "Weapon", base: "Base Alpha", available: 1, assigned: 0, status: "Sufficient" },
  { name: "M4 Rifle", type: "Weapon", base: "Base Bravo", available: 80, assigned: 0, status: "Sufficient" },
  { name: "M4 Rifle", type: "Weapon", base: "Base Alpha", available: 120, assigned: 0, status: "Sufficient" },
  { name: "M9 Pistol", type: "Weapon", base: "Base Alpha", available: 50, assigned: 0, status: "Sufficient" },
  { name: "M9 Pistol", type: "Weapon", base: "Base Bravo", available: 40, assigned: 0, status: "Sufficient" },
  { name: "Extra 1", type: "Weapon", base: "Base Delta", available: 10, assigned: 0, status: "Sufficient" },
  { name: "Extra 2", type: "Weapon", base: "Base Delta", available: 5, assigned: 0, status: "Sufficient" },
  { name: "Extra 3", type: "Vehicle", base: "Base Echo", available: 2, assigned: 0, status: "Insufficient" },
  { name: "Extra 4", type: "Ammunition", base: "Base Echo", available: 300, assigned: 0, status: "Sufficient" },
];

const AssetFilterModal = ({ show, onClose, base, setBase, type, setType, search, setSearch, onReset, onApply }) => {
  if (!show) return null;
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-wrap gap-6 justify-between relative">
      <button aria-label="Close" onClick={onClose} className="absolute top-5 right-5 cursor-pointer text-gray-700 hover:text-gray-900">
        <XMarkIcon className="w-6 h-6" />
      </button>
      <h2 className="text-xl font-bold mb-5 tracking-tight w-full">Filters</h2>
      <form className="mb-0 w-full flex flex-wrap gap-6 justify-between">
        <div className="flex flex-col min-w-[140px] max-w-sm">
          <label className="text-gray-700 font-semibold" htmlFor="filterBase">Base</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600"
            value={base}
            onChange={e => setBase(e.target.value)}
            id="filterBase"
          >
            <option>All Bases</option>
            {baseOptions.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex flex-col flex-grow min-w-[140px] max-w-sm">
          <label className="text-gray-700 font-semibold mb-2" htmlFor="filterType">Asset Type</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600"
            value={type}
            onChange={e => setType(e.target.value)}
            id="filterType"
          >
            <option>All Types</option>
            {typeOptions.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col flex-grow min-w-[180px] max-w-md">
          <label className="text-gray-700 font-semibold mb-2" htmlFor="filterSearch">Search</label>
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="filterSearch"
          />
        </div>
      </form>
      <div className="w-full flex justify-end gap-5 mt-6">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
          onClick={onReset}
        >
          Reset
        </button>
        <button
          type="button"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          onClick={onApply}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

const AssetFormPage = ({ show, onClose, addAsset, errorState, assetForm, setAssetForm }) => {
  if (!show) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full border border-gray-300">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onClose} className="text-blue-700 hover:text-blue-900">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Create New Asset</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addAsset();
          }}
        >
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="asset-name">
                Asset Name
              </label>
              <input
                id="asset-name"
                type="text"
                placeholder="Enter asset name"
                value={assetForm.name}
                onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base placeholder-gray-400 outline-none transition ${errorState.name ? "border-red-600" : "border-gray-300"
                  } focus:border-blue-600`}
              />
              {errorState.name && <p className="text-red-600 text-sm mt-1">{errorState.name}</p>}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="asset-type">
                Asset Type
              </label>
              <select
                id="asset-type"
                value={assetForm.type}
                onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none cursor-pointer transition ${errorState.type ? "border-red-600" : "border-gray-300"
                  } focus:border-blue-600 bg-white`}
              >
                <option value="">Select Type</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errorState.type && <p className="text-red-600 text-sm mt-1">{errorState.type}</p>}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="asset-base">
                Base
              </label>
              <select
                id="asset-base"
                value={assetForm.base}
                onChange={(e) => setAssetForm({ ...assetForm, base: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none cursor-pointer transition ${errorState.base ? "border-red-600" : "border-gray-300"
                  } focus:border-blue-600 bg-white`}
              >
                <option value="">Select Base</option>
                {baseOptions.map((base) => (
                  <option key={base} value={base}>
                    {base}
                  </option>
                ))}
              </select>
              {errorState.base && <p className="text-red-600 text-sm mt-1">{errorState.base}</p>}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700" htmlFor="opening-balance">
                Opening Balance
              </label>
              <input
                id="opening-balance"
                type="number"
                min="0"
                value={assetForm.available}
                onChange={(e) => setAssetForm({ ...assetForm, available: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base placeholder-gray-400 outline-none transition ${errorState.available ? "border-red-600" : "border-gray-300"
                  } focus:border-blue-600`}
              />
              {errorState.available && <p className="text-red-600 text-sm mt-1">{errorState.available}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-700 border-2 border-gray-400 rounded-lg px-6 py-3 font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-8 py-3 font-bold shadow-lg hover:bg-blue-700 transition"
            >
              Create Asset
            </button>
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
  const [showAddPage, setShowAddPage] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", type: "", base: "", available: 0 });
  const [errorState, setErrorState] = useState({});
  const [hoveredAction, setHoveredAction] = useState(null);

  const [baseFilter, setBaseFilter] = useState("All Bases");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchFilter, setSearchFilter] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({ base: "All Bases", type: "All Types", search: "" });

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setAssets(JSON.parse(saved));
    else {
      setAssets(defaultAssets);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultAssets));
    }
  }, []);

  let filteredAssets = assets;
  if (appliedFilters.base !== "All Bases") filteredAssets = filteredAssets.filter(a => a.base === appliedFilters.base);
  if (appliedFilters.type !== "All Types") filteredAssets = filteredAssets.filter(a => a.type === appliedFilters.type);
  if (appliedFilters.search.trim() !== "") filteredAssets = filteredAssets.filter(a => a.name.toLowerCase().includes(appliedFilters.search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const pagedAssets = filteredAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleResetFilters = () => {
    setBaseFilter("All Bases");
    setTypeFilter("All Types");
    setSearchFilter("");
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ base: baseFilter, type: typeFilter, search: searchFilter.trim() });
    setPage(1);
    setShowFilter(false);
  };

  const startEditing = (index) => {
    setEditIndex(index);
    const asset = assets[index];
    setEditForm({
      name: asset.name,
      type: asset.type,
      base: asset.base,
      available: asset.available
    });
  };

  const cancelEditing = () => {
    setEditIndex(null);
    setEditForm({ name: "", type: "", base: "", available: 0 });
    setErrorState({});
  };

  const validateEditForm = () => {
    let err = {};
    if (!editForm.name.trim()) err.name = "Name is required";
    if (!editForm.type.trim()) err.type = "Type is required";
    if (!editForm.base.trim()) err.base = "Base is required";
    if (editForm.available === "" || editForm.available === null || isNaN(editForm.available) || Number(editForm.available) < 0) {
      err.available = "Enter a non-negative number";
    }
    setErrorState(err);
    return Object.keys(err).length === 0;
  };

  const saveEdit = () => {
    if (!validateEditForm()) return;
    const updatedAssets = [...assets];
    updatedAssets[editIndex] = {
      name: editForm.name.trim(),
      type: editForm.type.trim(),
      base: editForm.base.trim(),
      available: Number(editForm.available),
      assigned: updatedAssets[editIndex].assigned,
      status: Number(editForm.available) > 0 ? "Sufficient" : "Insufficient"
    };
    setAssets(updatedAssets);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedAssets));
    cancelEditing();
  };

  const handleAssetAdd = () => {
    if (!validateEditForm()) return;
    const asset = {
      name: editForm.name.trim(),
      type: editForm.type.trim(),
      base: editForm.base.trim(),
      available: Number(editForm.available) || 0,
      assigned: 0,
      status: Number(editForm.available) > 0 ? "Sufficient" : "Insufficient"
    };
    const newAssets = [asset, ...assets];
    setAssets(newAssets);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newAssets));
    setPage(1);
    setEditForm({ name: "", type: "", base: "", available: 0 });
    setErrorState({});
    setShowAddPage(false);
  };

  if (showAddPage) {
    return (
      <div className="bg-gray-50 min-h-screen w-full p-9">
        <AssetFormPage
          show
          onClose={() => {
            setEditForm({ name: "", type: "", base: "", available: 0 });
            setShowAddPage(false);
            setErrorState({});
          }}
          addAsset={handleAssetAdd}
          errorState={errorState}
          assetForm={editForm}
          setAssetForm={setEditForm}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto mt-10 px-3 font-sans">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-6">
        <h1 className="text-3xl font-bold text-[#181C32] min-w-[200px] flex-grow">Assets</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setShowFilter(true)} className="flex items-center gap-1 border border-[#DDD] px-4 py-2 rounded-lg font-semibold text-[#29376F] text-sm cursor-pointer shadow-sm hover:border-gray-400 transition">
            <MagnifyingGlassIcon className="w-4 h-4 text-[#29376F]" />
            Filters
          </button>
          <button onClick={() => setShowAddPage(true)} className="flex items-center gap-1 bg-[#198CF7] text-white px-5 py-2 rounded-lg font-bold shadow-sm hover:bg-[#136BFE] transition cursor-pointer">
            <PlusIcon className="w-4 h-4" />
            Add Asset
          </button>
        </div>
      </div>

      <AssetFilterModal
        show={showFilter}
        onClose={() => setShowFilter(false)}
        base={baseFilter}
        setBase={setBaseFilter}
        type={typeFilter}
        setType={setTypeFilter}
        search={searchFilter}
        setSearch={setSearchFilter}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse min-w-[650px] text-left text-[13px] text-[#182233]">
          <thead>
            <tr className="bg-[#FAFAFB] text-[#181C32] font-bold border-b border-gray-300">
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">NAME ↑</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">TYPE</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">BASE</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">AVAILABLE</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">ASSIGNED</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">STATUS</th>
              <th className="px-3 py-4 text-right whitespace-nowrap">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((asset, idx) => {
              const globalIndex = (page - 1) * PAGE_SIZE + idx;
              if (editIndex === globalIndex) {
                return (
                  <tr key={globalIndex} className="border-b border-gray-200 last:border-b-0 bg-white">
                    <td className="px-3 py-4 border-r border-gray-300">
                      <input
                        className={`w-full text-[13px] rounded px-2 py-1 ${errorState.name ? "border-red-600" : "border-gray-300"} border`}
                        value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      {errorState.name && <p className="text-red-600 mt-1 text-xs">{errorState.name}</p>}
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <select
                        className={`w-full rounded px-2 py-1 border text-[13px] ${errorState.type ? "border-red-600" : "border-gray-300"}`}
                        value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                      >
                        <option value="">Select Type</option>
                        {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errorState.type && <p className="text-red-600 mt-1 text-xs">{errorState.type}</p>}
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <select
                        className={`w-full rounded px-2 py-1 border text-[13px] ${errorState.base ? "border-red-600" : "border-gray-300"}`}
                        value={editForm.base} onChange={e => setEditForm({ ...editForm, base: e.target.value })}
                      >
                        <option value="">Select Base</option>
                        {baseOptions.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      {errorState.base && <p className="text-red-600 mt-1 text-xs">{errorState.base}</p>}
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <input
                        type="number" min="0"
                        className={`w-20 text-[13px] rounded px-2 py-1 border ${errorState.available ? "border-red-600" : "border-gray-300"}`}
                        value={editForm.available} onChange={e => setEditForm({ ...editForm, available: e.target.value })}
                      />
                      {errorState.available && <p className="text-red-600 mt-1 text-xs">{errorState.available}</p>}
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300 text-[13px]">{asset.assigned}</td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <span className={`inline-block text-[12px] font-semibold rounded-full px-3 py-1 ${Number(editForm.available) > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {Number(editForm.available) > 0 ? "Sufficient" : "Insufficient"}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <div className="flex gap-3 justify-end">
                        <button onClick={saveEdit} className="text-blue-600 font-semibold text-sm hover:underline cursor-pointer">Save</button>
                        <button onClick={cancelEditing} className="text-red-600 font-semibold text-sm hover:underline cursor-pointer">Cancel</button>
                      </div>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={globalIndex} className="even:bg-gray-50 hover:bg-blue-50">
                  <td className="px-3 py-4 border-r border-gray-300 text-blue-600 font-semibold underline cursor-pointer whitespace-nowrap">{asset.name}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.type}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.base}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.available}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.assigned}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">
                    <span className={`inline-block text-[12px] font-semibold rounded-full px-3 py-1 ${asset.available > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    <div className="flex gap-4 justify-end">
                      <button
                        onClick={() => alert(`View ${asset.name}`)}
                        className="text-blue-600 font-semibold text-sm hover:underline cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => startEditing(globalIndex)}
                        className="text-blue-800 font-semibold text-sm hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => alert(`Delete ${asset.name}`)}
                        className="text-red-600 font-semibold text-sm hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex flex-wrap justify-end items-center gap-4 p-4 text-sm">
          <span>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAssets.length)} to {Math.min(page * PAGE_SIZE, filteredAssets.length)} of {filteredAssets.length} results
          </span>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${page === 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${page === idx + 1 ? "bg-blue-600 text-white border-blue-600" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${page === totalPages ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetManager;
