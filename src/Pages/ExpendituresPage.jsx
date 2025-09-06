import React, { useState, useEffect } from "react"
import { FunnelIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

const BASES = ["All Bases", "Base Alpha", "Base Bravo"]
const TYPES = ["All Types", "Ammunition", "Vehicle"]
const REASONS = ["All Reasons", "Training", "Operation", "Routine", "Other"]
const PAGE_SIZE = 10

const initialRows = [
  {
    asset: "5.56mm Ammunition",
    assetType: "Ammunition",
    base: "Base Alpha",
    quantity: 1000,
    reason: "Training",
    notes: "Marksmanship Training",
    expendedBy: {
      name: "Firearms Instructor",
      rank: "Sergeant",
      id: ""
    },
    date: "May 10, 2025",
    location: "",
  }
]

function getTodayDMY() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

export default function ExpendituresPage() {
  const [showFilter, setShowFilter] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rows, setRows] = useState(initialRows)
  const [filter, setFilter] = useState({
    base: "All Bases",
    assetType: "All Types",
    reason: "All Reasons",
    startDate: "",
    endDate: "",
    search: ""
  })
  const [form, setForm] = useState({
    asset: "",
    assetType: "",
    base: "",
    quantity: 1,
    reason: "",
    notes: "",
    expendedByName: "",
    expendedByRank: "",
    expendedById: "",
    date: getTodayDMY(),
    location: ""
  })
  const [errors, setErrors] = useState({})
  const [page, setPage] = useState(1)

  useEffect(() => {
    const savedRows = localStorage.getItem("expenditures")
    if (savedRows) setRows(JSON.parse(savedRows))
  }, [])

  useEffect(() => {
    localStorage.setItem("expenditures", JSON.stringify(rows))
  }, [rows])

  function parseUserDate(txt) {
    if (!txt) return null
    const [dd, mm, yyyy] = txt.split("-")
    if (!dd || !mm || !yyyy) return null
    return new Date(`${yyyy}-${mm}-${dd}`)
  }

  function parseTableDate(txt) {
    if (!txt) return null
    const d = new Date(txt.replace(/(\d{1,2}) (\w+), (\d{4})/, '$1 $2 $3'))
    return isNaN(d) ? null : d
  }

  const filteredRows = rows.filter(row => {
    if (filter.base !== "All Bases" && row.base !== filter.base) return false
    if (filter.assetType !== "All Types" && row.assetType !== filter.assetType) return false
    if (filter.reason !== "All Reasons" && row.reason !== filter.reason) return false

    if (filter.startDate) {
      const fStart = parseUserDate(filter.startDate)
      const d = parseTableDate(row.date)
      if (fStart && d && d < fStart) return false
    }
    if (filter.endDate) {
      const fEnd = parseUserDate(filter.endDate)
      const d = parseTableDate(row.date)
      if (fEnd && d && d > fEnd) return false
    }
    if (filter.search && filter.search.trim()) {
      const q = filter.search.trim().toLowerCase()
      const str = (
        row.asset +
        row.base +
        row.assetType +
        (row.reason || "") +
        (row.notes || "") +
        (row.expendedBy.name || "") +
        (row.expendedBy.rank || "")
      ).toLowerCase()
      if (!str.includes(q)) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const paginatedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleApply() {
    setShowFilter(false)
    setPage(1)
  }

  function handleReset() {
    setFilter({
      base: "All Bases",
      assetType: "All Types",
      reason: "All Reasons",
      startDate: "",
      endDate: "",
      search: ""
    })
    setShowFilter(false)
    setPage(1)
  }

  function validateFormData(f) {
    const e = {}
    if (!f.asset) e.asset = "Select an asset"
    if (!f.assetType) e.assetType = "Select asset type"
    if (!f.base) e.base = "Select base"
    if (!f.reason) e.reason = "Select reason"
    if (!f.quantity || Number(f.quantity) < 1) e.quantity = "Enter quantity"
    if (!f.expendedByName) e.expendedByName = "Expended by (name) required"
    if (!f.expendedByRank) e.expendedByRank = "Expended by (rank) required"
    if (!f.date) e.date = "Enter expenditure date"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    if (!validateFormData(form)) return
    setRows([
      {
        asset: form.asset,
        assetType: form.assetType,
        base: form.base,
        quantity: Number(form.quantity),
        reason: form.reason,
        notes: form.notes,
        expendedBy: {
          name: form.expendedByName,
          rank: form.expendedByRank,
          id: form.expendedById
        },
        date: form.date
          .split("-")
          .map((part, i) =>
            i === 1
              ? ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(part)]
              : part
          )
          .reverse()
          .join(" "),
        location: form.location
      },
      ...rows
    ])
    setShowForm(false)
    setForm({
      asset: "",
      assetType: "",
      base: "",
      quantity: 1,
      reason: "",
      notes: "",
      expendedByName: "",
      expendedByRank: "",
      expendedById: "",
      date: getTodayDMY(),
      location: ""
    })
    setErrors({})
    setPage(1)
  }

  return (
    <div className="max-w-[1100px] mx-auto mt-10 px-3 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-[#181C32] min-w-[200px] flex-grow">Expenditures</h1>
          <div className="flex flex-wrap gap-3">
            <button
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold border border-[#CBD2E0] bg-white hover:bg-gray-50 focus:outline-none ${
                showFilter ? "ring-2 ring-blue-200" : ""
              }`}
              onClick={() => setShowFilter(true)}
            >
              <FunnelIcon className="w-5 h-5" /> Filters
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 px-5 py-2 rounded-lg text-white font-bold bg-[#039BE5] hover:bg-[#0277BD] shadow-sm"
            >
              <PlusIcon className="w-5 h-5" /> New Expenditure
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 flex flex-wrap gap-6 justify-between">
            <div className="flex flex-col min-w-[180px] flex-1">
              <label className="font-semibold mb-1 text-gray-700">Base</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filter.base}
                onChange={e => setFilter(f => ({ ...f, base: e.target.value }))}
              >
                {BASES.map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col min-w-[180px] flex-1">
              <label className="font-semibold mb-1 text-gray-700">Asset Type</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filter.assetType}
                onChange={e => setFilter(f => ({ ...f, assetType: e.target.value }))}
              >
                {TYPES.map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col min-w-[180px] flex-1">
              <label className="font-semibold mb-1 text-gray-700">Reason</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filter.reason}
                onChange={e => setFilter(f => ({ ...f, reason: e.target.value }))}
              >
                {REASONS.map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col min-w-[180px] flex-1">
              <label className="font-semibold mb-1 text-gray-700">Start Date</label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filter.startDate}
                onChange={e => setFilter(f => ({ ...f, startDate: e.target.value }))}
              />
            </div>
            <div className="flex flex-col min-w-[180px] flex-1">
              <label className="font-semibold mb-1 text-gray-700">End Date</label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filter.endDate}
                onChange={e => setFilter(f => ({ ...f, endDate: e.target.value }))}
              />
            </div>
            <div className="flex flex-col flex-grow min-w-[200px]">
              <label className="font-semibold mb-1 text-gray-700">Search</label>
              <input
                type="text"
                placeholder="Search by asset name, operation, or personnel"
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={filter.search}
                onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
              />
            </div>
            <div className="flex w-full justify-end gap-3 mt-4">
              <button
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-8 bg-white p-6 rounded-xl shadow border border-gray-300 max-w-5xl mx-auto">
            <div className="flex items-center mb-8 space-x-2">
              <button type="button" className="text-[#1E40AF] hover:text-[#004ba8]" onClick={() => setShowForm(false)}>
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold ml-2">New Expenditure</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Asset</label>
                <input
                  className="border rounded w-full px-4 py-3"
                  placeholder="Select an asset"
                  value={form.asset}
                  onChange={e => setForm(f => ({ ...f, asset: e.target.value }))}
                  required
                />
                {errors.asset && <p className="text-sm text-red-600 mt-1">{errors.asset}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Asset Type</label>
                <select
                  className="border rounded w-full px-4 py-3"
                  value={form.assetType}
                  onChange={e => setForm(f => ({ ...f, assetType: e.target.value }))}
                  required
                >
                  <option value="">Select an asset type</option>
                  {TYPES.filter(t => t !== "All Types").map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                {errors.assetType && <p className="text-sm text-red-600 mt-1">{errors.assetType}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Base</label>
                <select
                  className="border rounded w-full px-4 py-3"
                  value={form.base}
                  onChange={e => setForm(f => ({ ...f, base: e.target.value }))}
                  required
                >
                  <option value="">Select a base</option>
                  {BASES.filter(b => b !== "All Bases").map(b => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                {errors.base && <p className="text-sm text-red-600 mt-1">{errors.base}</p>}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">Quantity</label>
                <input
                  className="border rounded w-full px-4 py-3"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                  required
                />
                {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Reason</label>
                <select
                  className="border rounded w-full px-4 py-3"
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  required
                >
                  <option value="">Select a reason</option>
                  {REASONS.filter(r => r !== "All Reasons").map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                {errors.reason && <p className="text-sm text-red-600 mt-1">{errors.reason}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Expended By (Name)</label>
                <input
                  className="border rounded w-full px-4 py-3"
                  value={form.expendedByName}
                  onChange={e => setForm(f => ({ ...f, expendedByName: e.target.value }))}
                  required
                />
                {errors.expendedByName && <p className="text-sm text-red-600 mt-1">{errors.expendedByName}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Expended By (Rank)</label>
                <input
                  className="border rounded w-full px-4 py-3"
                  value={form.expendedByRank}
                  onChange={e => setForm(f => ({ ...f, expendedByRank: e.target.value }))}
                  required
                />
                {errors.expendedByRank && <p className="text-sm text-red-600 mt-1">{errors.expendedByRank}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Expended By (ID)</label>
                <input
                  className="border rounded w-full px-4 py-3"
                  value={form.expendedById}
                  onChange={e => setForm(f => ({ ...f, expendedById: e.target.value }))}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Expenditure Date</label>
                <input
                  className="border rounded w-full px-4 py-3"
                  type="text"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                  placeholder="dd-mm-yyyy"
                />
                {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Location</label>
                <input
                  className="border rounded w-full px-4 py-3"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Optional location"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block mb-2 font-semibold text-gray-700">Notes</label>
                <textarea
                  rows={2}
                  className="border rounded w-full px-4 py-3"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Optional notes about this expenditure"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Expenditure
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto">
          <table className="w-full border-collapse min-w-[650px] text-left text-[13px] text-[#182233]">
            <thead>
              <tr className="bg-[#FAFAFB] text-[#181C32] font-bold border-b border-gray-300">
                <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">ASSET</th>
                <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">BASE</th>
                <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">QUANTITY</th>
                <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">REASON</th>
                <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">EXPENDED BY</th>
                <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">DATE</th>
                <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No expenditures found.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr className="border-b border-gray-100 hover:bg-[#F1FAFE]" key={idx}>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <span className="block font-semibold text-blue-600 cursor-pointer hover:underline">{row.asset}</span>
                      <span className="block text-[13px] text-gray-500 mt-1">{row.assetType}</span>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">{row.base}</td>
                    <td className="px-3 py-4 border-r border-gray-300">{row.quantity}</td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <span className="inline-block bg-blue-100 text-blue-700 font-semibold rounded-full px-3 py-1 text-[12px] mb-1">{row.reason}</span>
                      <span className="block text-[13px] text-gray-500">{row.notes}</span>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">
                      <span className="block">{row.expendedBy.name}</span>
                      <span className="block text-[13px] text-gray-500">{row.expendedBy.rank}</span>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-300">{row.date}</td>
                    <td className="px-3 py-4 border-r border-gray-300 text-blue-600 font-semibold text-sm hover:underline cursor-pointer text-right">View</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex flex-wrap justify-between items-center px-5 py-3 gap-3">
            <span className="text-sm text-gray-700">
              Showing {filteredRows.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredRows.length)} of {filteredRows.length} results
            </span>
            <div className="flex items-center gap-2">
              <select className="border border-gray-300 rounded px-2 py-1 text-sm" value={PAGE_SIZE} disabled>
                <option>{PAGE_SIZE} per page</option>
              </select>
              <button
                className="px-2 py-1 rounded border border-gray-300 text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                &lt;
              </button>

              <span className="w-10 h-8 flex items-center justify-center border border-blue-600 rounded font-bold text-blue-600 select-none">{page}</span>

              <button
                className="px-2 py-1 rounded border border-gray-300 text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
