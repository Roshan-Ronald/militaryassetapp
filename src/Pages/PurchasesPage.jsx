import React, { useState, useEffect } from "react"
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

const PAGE_SIZE = 10
const BASES = ['Base Alpha', 'Base Bravo']
const ASSET_TYPES = ['Weapon', 'Vehicle']
const STATUSES = ['Delivered', 'Pending', 'Cancelled']

const initialPurchases = [
  { asset: 'nn', assetType: 'Weapon', base: 'Base Bravo', supplier: 'Tech Defense Systems', quantity: 2, unitCost: 90, totalCost: 180, status: 'Delivered', date: '15-08-2025', invoice: '', notes: '' },
  { asset: 'M4 Rifle', assetType: 'Weapon', base: 'Base Alpha', supplier: 'Military Weapons Inc.', quantity: 20, unitCost: 1200, totalCost: 24000, status: 'Delivered', date: '10-05-2025', invoice: '', notes: '' },
]

function getToday() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

function parseDate(input) {
  const [d, m, y] = input.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState(initialPurchases)
  const [showFilter, setShowFilter] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [page, setPage] = useState(1)

  const [filter, setFilter] = useState({
    base: "All Bases",
    assetType: "All Types",
    status: "All Statuses",
    query: "",
  })

  const [newPurchase, setNewPurchase] = useState({
    asset: "",
    assetType: "",
    base: "",
    supplier: "",
    quantity: 1,
    unitCost: 0,
    totalCost: 0,
    status: "",
    date: getToday(),
    invoice: "",
    notes: "",
  })

  useEffect(() => {
    setNewPurchase(np => ({
      ...np,
      totalCost: Number(np.quantity) * Number(np.unitCost)
    }))
  }, [newPurchase.quantity, newPurchase.unitCost])

  const filtered = purchases.filter(p => {
    if (filter.base !== "All Bases" && p.base !== filter.base) return false
    if (filter.assetType !== "All Types" && p.assetType !== filter.assetType) return false
    if (filter.status !== "All Statuses" && p.status !== filter.status) return false
    if (filter.query.trim() && !(
      p.asset.toLowerCase().includes(filter.query.toLowerCase()) ||
      p.assetType.toLowerCase().includes(filter.query.toLowerCase()) ||
      p.supplier.toLowerCase().includes(filter.query.toLowerCase()) ||
      (p.invoice && p.invoice.toLowerCase().includes(filter.query.toLowerCase()))
    )) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterChange(e) {
    const { name, value } = e.target
    setFilter(f => ({ ...f, [name]: value }))
  }

  function resetFilters() {
    setFilter({ base: "All Bases", assetType: "All Types", status: "All Statuses", query: "" })
    setShowFilter(false)
    setPage(1)
  }

  function applyFilters() {
    setShowFilter(false)
    setPage(1)
  }

  function handleNewChange(e) {
    const { name, value } = e.target
    setNewPurchase(np => ({
      ...np,
      [name]: name === "quantity" || name === "unitCost" ? value.replace(/[^0-9]/g, '') : value,
    }))
  }

  function addPurchase(e) {
    e.preventDefault()
    const purchase = { ...newPurchase, totalCost: Number(newPurchase.quantity) * Number(newPurchase.unitCost) }
    setPurchases([purchase, ...purchases])
    setNewPurchase({
      asset: "", assetType: "", base: "", supplier: "", quantity: 1,
      unitCost: 0, totalCost: 0, status: "", date: getToday(), invoice: "", notes: ""
    })
    setShowNew(false)
    setPage(1)
  }

  return (
    <div className="max-w-[1100px] mx-auto mt-10 px-3 font-sans">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-6">
        <h1 className="text-3xl font-bold text-[#181C32] min-w-[200px] flex-grow">Purchases</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFilter(v => !v)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold border border-[#CBD2E0] bg-white hover:bg-gray-50 focus:outline-none ${showFilter ? 'ring-2 ring-blue-200' : ''}`}
          >
            <FunnelIcon className="w-5 h-5" />
            Filters
          </button>

          <button onClick={() => setShowNew(true)} className="flex items-center gap-1 bg-[#198CF7] text-white px-5 py-2 rounded-lg font-bold shadow-sm hover:bg-[#136BFE] transition cursor-pointer">
            <PlusIcon className="w-4 h-4" />
            Add Purchase
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-wrap gap-6 justify-between relative">
          <button aria-label="Close" onClick={() => setShowFilter(false)} className="absolute top-5 right-5 cursor-pointer text-gray-700 hover:text-gray-900">
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="flex flex-col min-w-[140px] max-w-sm">
            <label className="text-gray-700 font-semibold mb-1">Base</label>
            <select name="base" className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600" value={filter.base} onChange={handleFilterChange}>
              <option>All Bases</option>
              {BASES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex flex-col min-w-[140px] max-w-sm">
            <label className="text-gray-700 font-semibold mb-1">Asset Type</label>
            <select name="assetType" className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600" value={filter.assetType} onChange={handleFilterChange}>
              <option>All Types</option>
              {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col min-w-[140px] max-w-sm">
            <label className="text-gray-700 font-semibold mb-1">Status</label>
            <select name="status" className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600" value={filter.status} onChange={handleFilterChange}>
              <option>All Statuses</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col flex-grow min-w-[180px] max-w-md">
            <label className="text-gray-700 font-semibold mb-1">Search</label>
            <input type="text" name="query" placeholder="Search by asset, type, supplier, or invoice" className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600" value={filter.query} onChange={handleFilterChange} />
          </div>
          <div className="w-full flex justify-end gap-5 mt-6">
            <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-100" onClick={resetFilters}>Reset</button>
            <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700" onClick={applyFilters}>Apply Filters</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto">
        <table className="w-full border-collapse min-w-[650px] text-left text-[13px] text-[#182233]">
          <thead>
            <tr className="bg-[#FAFAFB] text-[#181C32] font-bold border-b border-gray-300">
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">ASSET</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">TYPE</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">BASE</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">QUANTITY</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">TOTAL COST ($)</th>
              <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">STATUS</th>
              <th className="px-3 py-4 text-right whitespace-nowrap">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={7} className="text-center p-4 text-gray-500">No purchases found.</td></tr>
            ) : paged.map((p, i) => (
              <tr key={i} className="even:bg-gray-50 hover:bg-blue-50">
                <td className="px-3 py-4 border-r border-gray-300 font-semibold text-blue-600 cursor-pointer">{p.asset}</td>
                <td className="px-3 py-4 border-r border-gray-300">{p.assetType}</td>
                <td className="px-3 py-4 border-r border-gray-300">{p.base}</td>
                <td className="px-3 py-4 border-r border-gray-300">{p.quantity}</td>
                <td className="px-3 py-4 border-r border-gray-300">{p.totalCost.toLocaleString()}</td>
                <td className="px-3 py-4 border-r border-gray-300">
                  <span className={`inline-block text-[12px] font-semibold rounded-full px-3 py-1 ${p.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-right">
                  <button className="text-blue-600 font-semibold text-sm hover:underline cursor-pointer">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-wrap justify-end items-center gap-4 p-4 text-sm">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} results
          </span>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${page === 1 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}>&lt;</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx} className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${page === idx + 1 ? "bg-blue-600 text-white border-blue-600" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`} onClick={() => setPage(idx + 1)}>{idx + 1}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`min-w-[30px] min-h-[30px] rounded text-sm font-semibold border ${page === totalPages ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}>&gt;</button>
        </div>
      </div>

      {showNew && (
        <div className="min-h-screen bg-gray-50 p-10 flex justify-center items-start fixed inset-0 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Purchase</h2>
              <button onClick={() => setShowNew(false)} className="text-gray-500 hover:text-gray-800 font-bold text-xl">×</button>
            </div>
            <form onSubmit={addPurchase} className="space-y-6">
              <input type="text" name="asset" value={newPurchase.asset} onChange={handleNewChange} placeholder="Asset Name" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <select name="assetType" value={newPurchase.assetType} onChange={handleNewChange} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 cursor-pointer">
                <option value="">Select Asset Type</option>
                {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <select name="base" value={newPurchase.base} onChange={handleNewChange} required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 cursor-pointer">
                <option value="">Select Base</option>
                {BASES.map(b => <option key={b}>{b}</option>)}
              </select>
              <input type="text" name="supplier" value={newPurchase.supplier} onChange={handleNewChange} placeholder="Supplier" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <input type="number" min="1" name="quantity" value={newPurchase.quantity} onChange={handleNewChange} placeholder="Quantity" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <input type="number" min="0" name="unitCost" value={newPurchase.unitCost} onChange={handleNewChange} placeholder="Unit Cost ($)" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <input type="text" name="totalCost" value={newPurchase.totalCost} readOnly className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed" />
              <input type="text" name="date" value={newPurchase.date} onChange={handleNewChange} placeholder="Purchase Date (dd-mm-yyyy)" required className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <input type="text" name="invoice" value={newPurchase.invoice} onChange={handleNewChange} placeholder="Invoice Number (optional)" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <textarea name="notes" value={newPurchase.notes} onChange={handleNewChange} placeholder="Notes (optional)" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"></textarea>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowNew(false)} className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
