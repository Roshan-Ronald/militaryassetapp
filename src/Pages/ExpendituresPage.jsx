import React, { useState, useEffect } from "react"
import { FunnelIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { getExpenditures, createExpenditure } from "../Api"

const BASES = ["All Bases", "Base Alpha", "Bravo"]
const TYPES = ["All Types", "Ammunition", "Vehicle"]
const REASONS = ["All Reasons", "Training", "Operation", "Routine", "Other"]
const PAGE_SIZE = 10

function getTodayDMY() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`
}

export default function ExpendituresPage() {
  const [showFilter, setShowFilter] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [rows, setRows] = useState([])
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
    async function fetchData() {
      const data = await getExpenditures()
      setRows(data)
    }
    fetchData()
  }, [])

  function parseUserDate(txt) {
    if (!txt) return null
    const [dd, mm, yyyy] = txt.split("-")
    if (!dd || !mm || !yyyy) return null
    return new Date(`${yyyy}-${mm}-${dd}`)
  }

  function parseTableDate(txt) {
    if (!txt) return null
    const d = new Date(txt.replace(/(\d{1,2}) (\w+), (\d{4})/, "$1 $2 $3"))
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
    if (filter.search?.trim()) {
      const q = filter.search.toLowerCase()
      const str = (row.asset + row.base + row.assetType + (row.reason || "") + (row.notes || "") + (row.expendedBy.name || "") + (row.expendedBy.rank || "")).toLowerCase()
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

  function validateForm(f) {
    const e = {}
    if (!f.asset.trim()) e.asset = "Select asset"
    if (!f.assetType.trim()) e.assetType = "Select asset type"
    if (!f.base.trim()) e.base = "Select base"
    if (!f.reason.trim()) e.reason = "Select reason"
    if (!f.quantity || Number(f.quantity) < 1) e.quantity = "Enter quantity"
    if (!f.expendedByName.trim()) e.expendedByName = "Expended by name required"
    if (!f.expendedByRank.trim()) e.expendedByRank = "Expended by rank required"
    if (!f.date.trim()) e.date = "Date required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm(form)) return

    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const [dd, mm, yyyy] = form.date.split("-")
    const formattedDate = `${dd} ${monthNames[Number(mm)]}, ${yyyy}`

    const expenditure = {
      id: Date.now(),
      asset: form.asset,
      assetType: form.assetType,
      base: form.base,
      quantity: Number(form.quantity),
      reason: form.reason,
      notes: form.notes,
      expendedBy: { name: form.expendedByName, rank: form.expendedByRank, id: form.expendedById },
      date: formattedDate,
      location: form.location
    }
    await createExpenditure(expenditure)
    const updated = await getExpenditures()
    setRows(updated)
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
    <div className="max-w-full lg:max-w-[1100px] mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 min-w-[200px] flex-grow">Expenditures</h1>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <button
            className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 transition ${showFilter ? "ring-2 ring-blue-300" : ""}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Filters
          </button>
          <button
            className="flex items-center gap-1 px-4 sm:px-5 py-2 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-sm"
            onClick={() => setShowForm(true)}
          >
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            New Expenditure
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white rounded-xl shadow border border-slate-200 p-4 sm:p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-end">
          <div>
            <label className="block mb-1 font-semibold text-sm text-slate-700">Base</label>
            <select className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filter.base} onChange={(e) => setFilter(f => ({ ...f, base: e.target.value }))}>
              {BASES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm text-slate-700">Asset Type</label>
            <select className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filter.assetType} onChange={e => setFilter(f => ({ ...f, assetType: e.target.value }))}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm text-slate-700">Reason</label>
            <select className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filter.reason} onChange={e => setFilter(f => ({ ...f, reason: e.target.value }))}>
              {REASONS.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-sm text-slate-700">Search</label>
            <input type="text" className="w-full border border-slate-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500" placeholder="Search..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
          </div>
          <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-end gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-2 border border-slate-300 rounded hover:bg-slate-100" onClick={handleReset}>Reset</button>
            <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleApply}>Apply</button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="max-w-lg sm:max-w-xl mx-auto bg-white rounded-xl shadow border border-slate-300 p-4 sm:p-6 mb-8 sm:mb-10">
          <button onClick={() => setShowForm(false)} className="mb-4 sm:mb-6 flex items-center text-blue-600 hover:underline gap-2">
            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            Back
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">New Expenditure</h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <input type="text" placeholder="Asset" name="asset" className="border border-slate-300 rounded px-3 py-2" value={form.asset} onChange={e => setForm({ ...form, asset: e.target.value })} required />
              <select name="assetType" className="border border-slate-300 rounded px-3 py-2" value={form.assetType} onChange={e => setForm({ ...form, assetType: e.target.value })} required>
                <option value="">Select Asset Type</option>
                {TYPES.filter(t => t !== "All Types").map(t => <option key={t}>{t}</option>)}
              </select>
              <select name="base" className="border border-slate-300 rounded px-3 py-2" value={form.base} onChange={e => setForm({ ...form, base: e.target.value })} required>
                <option value="">Select Base</option>
                {BASES.filter(b => b !== "All Bases").map(b => <option key={b}>{b}</option>)}
              </select>
              <input type="number" name="quantity" min="1" className="border border-slate-300 rounded px-3 py-2" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
              <select name="reason" className="border border-slate-300 rounded px-3 py-2" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required>
                <option value="">Select Reason</option>
                {REASONS.filter(r => r !== "All Reasons").map(r => <option key={r}>{r}</option>)}
              </select>
              <input type="text" name="expendedByName" placeholder="Expended By Name" className="border border-slate-300 rounded px-3 py-2" value={form.expendedByName} onChange={e => setForm({ ...form, expendedByName: e.target.value })} required />
              <input type="text" name="expendedByRank" placeholder="Expended By Rank" className="border border-slate-300 rounded px-3 py-2" value={form.expendedByRank} onChange={e => setForm({ ...form, expendedByRank: e.target.value })} required />
              <input type="text" name="expendedById" placeholder="Expended By ID (optional)" className="border border-slate-300 rounded px-3 py-2" value={form.expendedById} onChange={e => setForm({ ...form, expendedById: e.target.value })} />
              <input type="text" name="date" placeholder="Date (dd-mm-yyyy)" className="border border-slate-300 rounded px-3 py-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              <input type="text" name="location" placeholder="Location (optional)" className="border border-slate-300 rounded px-3 py-2" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <textarea name="notes" placeholder="Notes (optional)" rows="3" className="border border-slate-300 rounded px-3 py-2 resize-none w-full" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            <div className="flex justify-end gap-3 sm:gap-4">
              <button type="button" className="px-3 sm:px-4 py-2 border border-slate-300 rounded hover:bg-slate-100" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl shadow border border-slate-300 bg-white">
        <table className="min-w-full border-collapse text-xs sm:text-sm md:text-base text-left text-slate-800">
          <thead className="bg-slate-100 font-semibold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">Asset</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">Base</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">Quantity</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">Reason</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">Expended By</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">Date</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td className="text-center p-3 sm:p-4 text-slate-500" colSpan={7}>No expenditures found.</td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-slate-50 hover:bg-slate-100">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">
                    <div className="font-semibold text-blue-600 cursor-pointer">{row.asset}</div>
                    <div className="text-xs text-slate-500">{row.assetType}</div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">{row.base}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">{row.quantity}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">
                    <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 sm:px-3 pb-0.5 pt-0.5 text-xs font-semibold">{row.reason}</span>
                    <div className="text-xs text-slate-500">{row.notes}</div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300">
                    <div>{row.expendedBy.name}</div>
                    <div className="text-xs text-slate-500">{row.expendedBy.rank}</div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300 whitespace-nowrap">{row.date}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 border border-slate-300 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-xs sm:text-sm">
        <div>Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  )
}
