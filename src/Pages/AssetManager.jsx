import React, { useState, useEffect } from "react"
import { FunnelIcon, PlusIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

const PAGE_SIZE = 10
const baseOptions = ["Base Alpha", "Base Bravo", "Base Charlie", "Base Delta", "Base Echo"]
const typeOptions = ["Vehicle", "Weapon", "Ammunition", "Equipment", "Other"]
const API_URL = "https://your-api-url.com/assets"

const defaultAssets = [
  { id: 1, name: "5.56mm Ammunition", type: "Ammunition", base: "Base Alpha", available: 9000, assigned: 0, status: "Sufficient" },
  { id: 2, name: "A16", type: "Weapon", base: "Base Charlie", available: 1, assigned: 0, status: "Sufficient" },
  { id: 3, name: "A16", type: "Weapon", base: "Base Alpha", available: 1, assigned: 0, status: "Sufficient" },
  { id: 4, name: "Humvee", type: "Vehicle", base: "Base Alpha", available: 20, assigned: 0, status: "Sufficient" },
  { id: 5, name: "Humvee", type: "Vehicle", base: "Base Bravo", available: 15, assigned: 0, status: "Sufficient" },
  { id: 6, name: "M4", type: "Weapon", base: "Base Alpha", available: 1, assigned: 0, status: "Sufficient" },
  { id: 7, name: "M4 Rifle", type: "Weapon", base: "Base Bravo", available: 80, assigned: 0, status: "Sufficient" },
  { id: 8, name: "M4 Rifle", type: "Weapon", base: "Base Alpha", available: 120, assigned: 0, status: "Sufficient" },
  { id: 9, name: "M9 Pistol", type: "Weapon", base: "Base Alpha", available: 50, assigned: 0, status: "Sufficient" },
  { id: 10, name: "M9 Pistol", type: "Weapon", base: "Base Bravo", available: 40, assigned: 0, status: "Sufficient" },
  { id: 11, name: "Extra 1", type: "Weapon", base: "Base Delta", available: 10, assigned: 0, status: "Sufficient" },
  { id: 12, name: "Extra 2", type: "Weapon", base: "Base Delta", available: 5, assigned: 0, status: "Sufficient" },
  { id: 13, name: "Extra 3", type: "Vehicle", base: "Base Echo", available: 2, assigned: 0, status: "Insufficient" },
  { id: 14, name: "Extra 4", type: "Ammunition", base: "Base Echo", available: 300, assigned: 0, status: "Sufficient" },
]

const AssetFilterModal = ({ show, onClose, base, setBase, type, setType, search, setSearch, onReset, onApply }) => {
  if (!show) return null
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row gap-6 justify-between relative max-w-full md:max-w-7xl mx-auto">
      <button aria-label="Close" onClick={onClose} className="absolute top-5 right-5 cursor-pointer text-gray-700 hover:text-gray-900 md:static md:self-start">
        <XMarkIcon className="w-6 h-6" />
      </button>
      <h2 className="text-xl font-bold mb-5 tracking-tight w-full md:w-auto">Filters</h2>
      <form className="mb-0 w-full md:flex md:gap-6">
        <div className="flex flex-col min-w-[140px] max-w-full mb-4 md:mb-0">
          <label htmlFor="filterBase" className="text-gray-700 font-semibold mb-1">Base</label>
          <select
            id="filterBase"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 w-full"
            value={base}
            onChange={(e) => setBase(e.target.value)}
          >
            <option>All Bases</option>
            {baseOptions.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex flex-col min-w-[140px] max-w-full mb-4 md:mb-0">
          <label htmlFor="filterType" className="text-gray-700 font-semibold mb-1">Asset Type</label>
          <select
            id="filterType"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>All Types</option>
            {typeOptions.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col min-w-[140px] max-w-full">
          <label htmlFor="filterSearch" className="text-gray-700 font-semibold mb-1">Search</label>
          <input
            id="filterSearch"
            type="text"
            placeholder="Search by name"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
      <div className="w-full flex justify-end gap-5 mt-4 md:mt-0 md:max-w-xs">
        <button type="button" onClick={onReset} className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-100 w-full md:w-auto">Reset</button>
        <button type="button" onClick={onApply} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 w-full md:w-auto">Apply Filters</button>
      </div>
    </div>
  )
}

const AssetFormPage = ({ show, onClose, onSubmit, errorState, assetForm, setAssetForm }) => {
  if (!show) return null
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full border border-gray-300">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onClose} className="text-blue-700 hover:text-blue-900">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">{assetForm.id ? "Edit Asset" : "Create New Asset"}</h1>
        </div>
        <form onSubmit={onSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="asset-name" className="block mb-2 font-semibold text-gray-700">Asset Name</label>
              <input
                id="asset-name"
                type="text"
                placeholder="Enter asset name"
                value={assetForm.name}
                onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base placeholder-gray-400 outline-none transition ${errorState.name ? "border-red-600" : "border-gray-300"} focus:border-blue-600`}
              />
              {errorState.name && <p className="text-red-600 text-sm mt-1">{errorState.name}</p>}
            </div>
            <div>
              <label htmlFor="asset-type" className="block mb-2 font-semibold text-gray-700">Asset Type</label>
              <select
                id="asset-type"
                value={assetForm.type}
                onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none cursor-pointer transition ${errorState.type ? "border-red-600" : "border-gray-300"} focus:border-blue-600 bg-white`}
              >
                <option value="">Select Type</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errorState.type && <p className="text-red-600 text-sm mt-1">{errorState.type}</p>}
            </div>
            <div>
              <label htmlFor="asset-base" className="block mb-2 font-semibold text-gray-700">Base</label>
              <select
                id="asset-base"
                value={assetForm.base}
                onChange={(e) => setAssetForm({ ...assetForm, base: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none cursor-pointer transition ${errorState.base ? "border-red-600" : "border-gray-300"} focus:border-blue-600 bg-white`}
              >
                <option value="">Select Base</option>
                {baseOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errorState.base && <p className="text-red-600 text-sm mt-1">{errorState.base}</p>}
            </div>
            <div>
              <label htmlFor="opening-balance" className="block mb-2 font-semibold text-gray-700">Opening Balance</label>
              <input
                id="opening-balance"
                type="number"
                min="0"
                value={assetForm.available}
                onChange={(e) => setAssetForm({ ...assetForm, available: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-base placeholder-gray-400 outline-none transition ${errorState.available ? "border-red-600" : "border-gray-300"} focus:border-blue-600`}
              />
              {errorState.available && <p className="text-red-600 text-sm mt-1">{errorState.available}</p>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-700 border-2 border-gray-400 rounded-lg px-6 py-3 font-semibold hover:bg-gray-100 transition w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-8 py-3 font-bold shadow-lg hover:bg-blue-700 transition w-full sm:w-auto"
            >
              {assetForm.id ? "Update Asset" : "Create Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AssetManager = () => {
  const [assets, setAssets] = useState([])
  const [page, setPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [showFormPage, setShowFormPage] = useState(false)
  const [editForm, setEditForm] = useState({ id: null, name: "", type: "", base: "", available: 0 })
  const [errorState, setErrorState] = useState({})
  const [baseFilter, setBaseFilter] = useState("All Bases")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [searchFilter, setSearchFilter] = useState("")
  const [appliedFilters, setAppliedFilters] = useState({ base: "All Bases", type: "All Types", search: "" })

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error("Fetch failed")
      const data = await res.json()
      setAssets(data)
    } catch (err) {
      console.error("Asset fetch error:", err)
      alert("Failed to fetch assets from API.")
      setAssets(defaultAssets)
    }
  }

  let filteredAssets = assets
  if (appliedFilters.base !== "All Bases") filteredAssets = filteredAssets.filter(a => a.base === appliedFilters.base)
  if (appliedFilters.type !== "All Types") filteredAssets = filteredAssets.filter(a => a.type === appliedFilters.type)
  if (appliedFilters.search.trim() !== "") filteredAssets = filteredAssets.filter(a => a.name.toLowerCase().includes(appliedFilters.search.toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE))
  const pagedAssets = filteredAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleResetFilters = () => {
    setBaseFilter("All Bases")
    setTypeFilter("All Types")
    setSearchFilter("")
    setAppliedFilters({ base: "All Bases", type: "All Types", search: "" })
  }

  const handleApplyFilters = () => {
    setAppliedFilters({ base: baseFilter, type: typeFilter, search: searchFilter.trim() })
    setPage(1)
    setShowFilter(false)
  }

  const validateForm = () => {
    const errors = {}
    if (!editForm.name.trim()) errors.name = "Name is required"
    if (!editForm.type.trim()) errors.type = "Type is required"
    if (!editForm.base.trim()) errors.base = "Base is required"
    if (
      editForm.available === "" ||
      editForm.available === null ||
      isNaN(editForm.available) ||
      Number(editForm.available) < 0
    )
      errors.available = "Enter a valid non-negative number"
    setErrorState(errors)
    return Object.keys(errors).length === 0
  }

  const openAddForm = () => {
    setEditForm({ id: null, name: "", type: "", base: "", available: 0 })
    setErrorState({})
    setShowFormPage(true)
  }

  const openEditForm = (asset) => {
    setEditForm({ ...asset })
    setErrorState({})
    setShowFormPage(true)
  }

  const closeForm = () => {
    setShowFormPage(false)
    setEditForm({ id: null, name: "", type: "", base: "", available: 0 })
    setErrorState({})
  }

  const submitForm = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const method = editForm.id ? "PUT" : "POST"
    const url = editForm.id ? `${API_URL}/${editForm.id}` : API_URL
    const payload = {
      name: editForm.name.trim(),
      type: editForm.type.trim(),
      base: editForm.base.trim(),
      available: Number(editForm.available),
      assigned: 0,
      status: Number(editForm.available) > 0 ? "Sufficient" : "Insufficient",
    }
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = await res.json()
      if (method === "POST") {
        setAssets((prev) => [data, ...prev])
      } else {
        setAssets((prev) => prev.map((a) => (a.id === data.id ? data : a)))
      }
      closeForm()
    } catch (err) {
      console.error("Submit form error:", err)
      alert(`Failed to ${editForm.id ? "update" : "add"} asset. Please check your API.`)
    }
  }

  const deleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      setAssets((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error("Delete asset error:", err)
      alert("Failed to delete asset. Please check your API.")
    }
  }

  return (
    <div className="max-w-full sm:max-w-7xl mx-auto mt-10 px-3 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 flex-wrap gap-6">
        <h1 className="text-3xl font-bold text-[#181C32] flex-grow min-w-[200px]">Assets</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold border border-[#CBD2E0] bg-white hover:bg-gray-50 focus:outline-none ${
              showFilter ? "ring-2 ring-blue-200" : ""
            }`}
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>
          <button
            onClick={openAddForm}
            className="flex items-center gap-1 bg-[#198CF7] text-white px-5 py-2 rounded-lg font-bold shadow-sm hover:bg-[#136BFE] transition cursor-pointer"
          >
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

      {showFormPage && (
        <AssetFormPage
          show={showFormPage}
          onClose={closeForm}
          onSubmit={submitForm}
          errorState={errorState}
          assetForm={editForm}
          setAssetForm={setEditForm}
        />
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse min-w-[320px] sm:min-w-[650px] text-left text-[13px] text-[#182233]">
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
            {pagedAssets.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No assets found
                </td>
              </tr>
            ) : (
              pagedAssets.map((asset) => (
                <tr key={asset.id} className="even:bg-gray-50 hover:bg-blue-50">
                  <td className="px-3 py-4 border-r border-gray-300 text-blue-600 font-semibold underline cursor-pointer whitespace-nowrap">{asset.name}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.type}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.base}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.available}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">{asset.assigned}</td>
                  <td className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">
                    <span
                      className={`inline-block text-[12px] font-semibold rounded-full px-3 py-1 ${
                        asset.available > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right whitespace-nowrap">
                    <div className="flex gap-4 justify-end flex-wrap">
                      <button
                        onClick={() => alert(`View ${asset.name}`)}
                        className="text-blue-600 font-semibold text-sm hover:underline cursor-pointer whitespace-nowrap"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditForm(asset)}
                        className="text-blue-800 font-semibold text-sm hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="text-red-600 font-semibold text-sm hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex flex-wrap justify-end items-center gap-4 p-4 text-sm">
          <span className="whitespace-nowrap">
            Showing {filteredAssets.length ? (page - 1) * PAGE_SIZE + 1 : 0} to {Math.min(page * PAGE_SIZE, filteredAssets.length)} of {filteredAssets.length} results
          </span>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${
              page === 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {"<"}
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${
                page === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${
              page === totalPages ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssetManager
