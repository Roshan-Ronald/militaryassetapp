import React, { useState, useEffect } from "react"
import { FunnelIcon } from '@heroicons/react/24/outline'

const baseOptions = ["Base Alpha", "Base Bravo", "Base Charlie"]
const PAGE_SIZE = 10

const defaultTransfers = [
  { asset: "vhvh", type: "Weapon", from: "Base Charlie", to: "Base Alpha", quantity: 1, status: "Completed", date: "Aug 17, 2025" },
  { asset: "5.56mm Ammunition", type: "Ammunition", from: "Base Bravo", to: "Base Charlie", quantity: 1, status: "Completed", date: "Aug 15, 2025" },
  { asset: "A16", type: "Weapon", from: "Base Alpha", to: "Base Charlie", quantity: 1, status: "Completed", date: "Aug 15, 2025" },
  { asset: "M4 Rifle", type: "Weapon", from: "Base Alpha", to: "Base Bravo", quantity: 10, status: "Completed", date: "May 10, 2025" }
]

const assetOptionsSelect = [
  "vhvh (Weapon) - Available: 900",
  "A16 (Weapon) - Available: 2",
  "M4 Rifle (Weapon) - Available: 100",
  "5.56mm Ammunition (Ammunition) - Available: 9000",
  "Humvee (Vehicle) - Available: 20"
]

export default function TransferManager() {
  const [transfers, setTransfers] = useState([])
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filterBase, setFilterBase] = useState("All")
  const [filterSearch, setFilterSearch] = useState("")
  const [formData, setFormData] = useState({
    asset: "",
    fromBase: "",
    toBase: "",
    quantity: 1,
    notes: ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const saved = localStorage.getItem("transfersData")
    if (saved) setTransfers(JSON.parse(saved))
    else setTransfers(defaultTransfers)
  }, [])

  useEffect(() => {
    localStorage.setItem("transfersData", JSON.stringify(transfers))
  }, [transfers])

  const filteredTransfers = transfers.filter(tr =>
    (filterBase === "All" || tr.from === filterBase || tr.to === filterBase) &&
    (tr.asset.toLowerCase().includes(filterSearch.toLowerCase()) || tr.type.toLowerCase().includes(filterSearch.toLowerCase()))
  )

  const totalPages = Math.max(1, Math.ceil(filteredTransfers.length / PAGE_SIZE))
  const pagedTransfers = filteredTransfers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.asset) newErrors.asset = "Asset is required"
    if (!formData.fromBase) newErrors.fromBase = "From Base is required"
    if (!formData.toBase) newErrors.toBase = "To Base is required"
    if (!formData.quantity || Number(formData.quantity) <= 0) newErrors.quantity = "Quantity must be greater than 0"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const parseAssetName = (str) => str.split(" (")[0]
  const parseAssetType = (str) => {
    const match = str.match(/\(([^)]+)\)/)
    return match ? match[1] : ""
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return
    const newTransfer = {
      asset: parseAssetName(formData.asset),
      type: parseAssetType(formData.asset),
      from: formData.fromBase,
      to: formData.toBase,
      quantity: Number(formData.quantity),
      status: "Completed",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      notes: formData.notes.trim()
    }
    setTransfers([newTransfer, ...transfers])
    setPage(1)
    setFormData({ asset: "", fromBase: "", toBase: "", quantity: 1, notes: "" })
    setErrors({})
    setShowForm(false)
  }

  return (
    <div className="max-w-[1100px] mx-auto mt-10 px-3 font-sans">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-6">
        <h1 className="text-3xl font-bold text-[#181C32] min-w-[200px] flex-grow">Transfers</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center cursor-pointer gap-1 px-4 py-2 rounded-lg text-sm font-semibold border border-[#CBD2E0] bg-white hover:bg-gray-50 focus:outline-none ${showFilters ? 'ring-2 ring-blue-200' : ''}`}
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 cursor-pointer bg-[#198CF7] px-5 py-2 rounded-lg text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            New Transfer
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-wrap gap-6 justify-between">
          <div className="flex flex-col min-w-[240px] max-w-[350px] gap-1">
            <label className="text-gray-700 font-semibold" htmlFor="filterBase">Base</label>
            <select
              id="filterBase"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={filterBase}
              onChange={e => { setFilterBase(e.target.value); setPage(1); }}
            >
              <option value="All">All Bases</option>
              {baseOptions.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex flex-col min-w-[240px] max-w-[350px] gap-1">
            <label className="text-gray-700 font-semibold" htmlFor="filterSearch">Search</label>
            <input
              id="filterSearch"
              type="text"
              placeholder="Search by asset or type"
              value={filterSearch}
              onChange={e => { setFilterSearch(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex items-end gap-4">
            <button
              onClick={() => {
                setFilterBase("All")
                setFilterSearch("")
                setPage(1)
              }}
              className="px-5 py-2 border cursor-pointer border-gray-300 rounded-lg text-white bg-blue-400 hover:bg-blue-800"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl mx-auto mb-8">
          <button onClick={() => setShowForm(false)} className="mb-6 text-blue-600 font-semibold hover:underline flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-3xl font-extrabold mb-8">New Transfer</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-[#29376F] font-semibold text-base">Asset</label>
              <select
                name="asset"
                value={formData.asset}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 text-base text-[#181C32] placeholder-gray-400 outline-none transition ${errors.asset ? "border-red-600" : "border-[#E3E6ED]"} focus:border-[#198CF7] focus:ring-4 focus:ring-[#198CF7]/20`}
              >
                <option value="">Select an asset</option>
                {assetOptionsSelect.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
              </select>
              {errors.asset && <p className="text-red-600 text-sm mt-2">{errors.asset}</p>}
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 text-[#29376F] font-semibold text-base">From Base</label>
                <select
                  name="fromBase"
                  value={formData.fromBase}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 text-base text-[#181C32] placeholder-gray-400 outline-none transition ${errors.fromBase ? "border-red-600" : "border-[#E3E6ED]"} focus:border-[#198CF7] focus:ring-4 focus:ring-[#198CF7]/20`}
                >
                  <option value="">Select a base</option>
                  {baseOptions.map((base, idx) => <option key={idx} value={base}>{base}</option>)}
                </select>
                {errors.fromBase && <p className="text-red-600 text-sm mt-2">{errors.fromBase}</p>}
              </div>
              <div>
                <label className="block mb-2 text-[#29376F] font-semibold text-base">To Base</label>
                <select
                  name="toBase"
                  value={formData.toBase}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg px-4 py-3 text-base text-[#181C32] placeholder-gray-400 outline-none transition ${errors.toBase ? "border-red-600" : "border-[#E3E6ED]"} focus:border-[#198CF7] focus:ring-4 focus:ring-[#198CF7]/20`}
                >
                  <option value="">Select a base</option>
                  {baseOptions.map((base, idx) => <option key={idx} value={base}>{base}</option>)}
                </select>
                {errors.toBase && <p className="text-red-600 text-sm mt-2">{errors.toBase}</p>}
              </div>
            </div>
            <div>
              <label className="block mb-2 text-[#29376F] font-semibold text-base">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-3 text-base text-[#181C32] placeholder-gray-400 outline-none transition ${errors.quantity ? "border-red-600" : "border-[#E3E6ED]"} focus:border-[#198CF7] focus:ring-4 focus:ring-[#198CF7]/20`}
              />
              {errors.quantity && <p className="text-red-600 text-sm mt-2">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block mb-2 text-[#29376F] font-semibold text-base">Notes</label>
              <textarea
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Optional notes about this transfer"
                className="w-full border border-[#E3E6ED] rounded-lg px-4 py-3 text-base text-[#181C32] placeholder-gray-400 outline-none focus:border-[#198CF7] focus:ring-4 focus:ring-[#198CF7]/20 resize-none"
              />
            </div>
            <div className="flex justify-end gap-6">
              <button type="button" onClick={() => setShowForm(false)} className="border border-[#198CF7] text-[#198CF7] cursor-pointer font-semibold px-8 py-3 rounded-lg hover:bg-[#198CF7]/10 transition">
                Cancel
              </button>
              <button type="submit" className="bg-[#198CF7] text-white font-semibold cursor-pointer px-8 py-3 rounded-lg shadow-lg hover:bg-[#136BFE] transition">
                Create Transfer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl shadow-md border border-gray-300 bg-white">
        <table className="min-w-full border-collapse text-sm text-left text-[#182233]">
          <thead>
            <tr className="bg-[#FAFAFB] text-[#181C32] font-bold border-b border-gray-300">
              <th className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">ASSET</th>
              <th className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">FROM</th>
              <th className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">TO</th>
              <th className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">QUANTITY</th>
              <th className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">STATUS</th>
              <th className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">DATE</th>
              <th className="px-4 py-4 text-right whitespace-nowrap">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pagedTransfers.length === 0 ? (
              <tr><td colSpan={7} className="py-5 text-center text-gray-500">No transfers found.</td></tr>
            ) : (
              pagedTransfers.map((tr, i) => (
                <tr key={i} className="hover:bg-[#EAF4FF] even:bg-gray-50">
                  <td className="px-4 py-4 border-r border-gray-300 text-[#198CF7] font-semibold underline cursor-pointer whitespace-nowrap">{tr.asset}</td>
                  <td className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">{tr.from}</td>
                  <td className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">{tr.to}</td>
                  <td className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">{tr.quantity}</td>
                  <td className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">
                    <span className="inline-block min-w-[60px] rounded-full bg-[#E3FBCF] text-[#259C1B] font-semibold text-xs text-center px-3 py-1">{tr.status}</span>
                  </td>
                  <td className="px-4 py-4 border-r border-gray-300 whitespace-nowrap">{tr.date}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <button onClick={() => alert(`View transfer: ${tr.asset}`)} className="text-[#198CF7] font-semibold hover:underline cursor-pointer">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-end items-center gap-4 p-4 text-sm">
        <span>
          Showing {pagedTransfers.length ? (page - 1) * PAGE_SIZE + 1 : 0} to {Math.min(page * PAGE_SIZE, filteredTransfers.length)} of {filteredTransfers.length} results
        </span>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className={`min-w-[30px] min-h-[30px] rounded font-semibold border ${page <= 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-[#198CF7] text-[#198CF7] hover:bg-[#198CF7] hover:text-white"}`}>&lt;</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} className={`min-w-[30px] min-h-[30px] rounded font-semibold border ${page === i + 1 ? "bg-[#198CF7] text-white border-[#198CF7]" : "border-[#198CF7] text-[#198CF7] hover:bg-[#198CF7] hover:text-white"}`}>
            {i + 1}
          </button>
        ))}
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className={`min-w-[30px] min-h-[30px] rounded font-semibold border ${page >= totalPages ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-[#198CF7] text-[#198CF7] hover:bg-[#198CF7] hover:text-white"}`}>&gt;</button>
      </div>
    </div>
  )
}
