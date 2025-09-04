import React, { useState } from 'react';
import { FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ASSIGNMENTS_INITIAL = [
    {
        asset: 'M4 Rifle',
        assetType: 'Weapon',
        base: 'Base Alpha',
        assignedTo: 'Squad Alpha<br/>Squad (SQ-001)',
        quantity: 20,
        returned: 20,
        purpose: 'Training Exercise',
        status: 'Returned',
        startDate: 'May 10, 2025',
        endDate: 'Aug 15, 2025'
    },
    {
        asset: 'Transport Truck',
        assetType: 'Vehicle',
        base: 'Base Bravo',
        assignedTo: 'Logistics Team<br/>LT-002',
        quantity: 1,
        returned: 0,
        purpose: 'Supply Transfer',
        status: 'Assigned',
        startDate: 'Jul 5, 2025',
        endDate: 'Aug 4, 2025'
    }
];

const BASES = ['All Bases', 'Base Alpha', 'Base Bravo'];
const TYPES = ['All Types', 'Weapon', 'Vehicle'];
const STATUSES = ['All Statuses', 'Returned', 'Assigned'];

export default function AssignmentsPage() {
    const [showFilter, setShowFilter] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [assignments, setAssignments] = useState(ASSIGNMENTS_INITIAL);
    const [filter, setFilter] = useState({
        base: 'All Bases',
        assetType: 'All Types',
        status: 'All Statuses',
        startDate: '',
        endDate: '',
        query: '',
    });

    const [newData, setNewData] = useState({
        asset: '',
        assetType: '',
        base: '',
        assignedTo: '',
        quantity: '',
        returned: '',
        purpose: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const filtered = assignments.filter(a => {
        if (filter.base !== 'All Bases' && a.base !== filter.base) return false;
        if (filter.assetType !== 'All Types' && a.assetType !== filter.assetType) return false;
        if (filter.status !== 'All Statuses' && a.status !== filter.status) return false;

        if (filter.startDate) {
            // Simple string compare or convert to Date for real validation if needed
            if (a.startDate < filter.startDate) return false;
        }
        if (filter.endDate) {
            if (a.endDate > filter.endDate) return false;
        }
        if (filter.query.trim()) {
            const q = filter.query.trim().toLowerCase();
            const str = (a.asset + a.assetType + a.base + a.assignedTo.replace(/<br\/?>/g, ' ') + a.purpose).toLowerCase();
            if (!str.includes(q)) return false;
        }
        return true;
    });

    const validateNewData = () => {
        const errors = {};
        if (!newData.asset.trim()) errors.asset = "Asset name is required";
        if (!newData.assetType.trim()) errors.assetType = "Asset type is required";
        if (!newData.base.trim()) errors.base = "Base is required";
        if (!newData.assignedTo.trim()) errors.assignedTo = "Assigned To is required";
        if (!newData.quantity.trim() || isNaN(newData.quantity) || Number(newData.quantity) <= 0) errors.quantity = "Quantity must be a positive number";
        if (!newData.returned.trim() || isNaN(newData.returned) || Number(newData.returned) < 0) errors.returned = "Returned must be zero or positive";
        if (!newData.purpose.trim()) errors.purpose = "Purpose is required";
        if (!newData.status.trim()) errors.status = "Status is required";
        if (!newData.startDate.trim()) errors.startDate = "Start Date is required";
        if (!newData.endDate.trim()) errors.endDate = "End Date is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddSubmit = e => {
        e.preventDefault();
        if (!validateNewData()) return;
        setAssignments([newData, ...assignments]);
        setNewData({
            asset: '',
            assetType: '',
            base: '',
            assignedTo: '',
            quantity: '',
            returned: '',
            purpose: '',
            status: '',
            startDate: '',
            endDate: ''
        });
        setFormErrors({});
        setShowAddForm(false);
    };

    return (
        <div className="max-w-[1100px] mx-auto mt-10 px-3 font-sans">

            <div className="flex justify-between items-center mb-6 flex-wrap gap-6">
                <h1 className="text-3xl font-bold text-[#181C32] min-w-[200px] flex-grow">Assignments</h1>
                <div className="flex gap-3">
                    <button onClick={() => setShowFilter(v => !v)} className={`flex items-center gap-1 px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold border border-[#CBD2E0] bg-white hover:bg-gray-50 focus:outline-none ${showFilter ? 'ring-2 ring-blue-200' : ''}`}>
                        <FunnelIcon className="w-5 h-5" /> Filters
                    </button>
                    <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 px-5 py-2 rounded-lg text-white font-bold bg-[#039BE5] hover:bg-[#0277BD] shadow-sm">
                        <PlusIcon className="w-5 h-5" /> New Assignment
                    </button>
                </div>
            </div>

            {showFilter && (
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-wrap gap-6">
                        <div className="flex flex-col min-w-[140px] flex-1 md:max-w-xs">
                            <label className="font-semibold mb-1 text-gray-700">Base</label>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={filter.base}
                                onChange={e => setFilter(f => ({ ...f, base: e.target.value }))}
                            >
                                {BASES.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col min-w-[140px] flex-1 md:max-w-xs">
                            <label className="font-semibold mb-1 text-gray-700">Asset Type</label>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={filter.assetType}
                                onChange={e => setFilter(f => ({ ...f, assetType: e.target.value }))}
                            >
                                {TYPES.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col min-w-[140px] flex-1 md:max-w-xs">
                            <label className="font-semibold mb-1 text-gray-700">Status</label>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={filter.status}
                                onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                            >
                                {STATUSES.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col min-w-[140px] flex-1 md:max-w-xs">
                            <label className="font-semibold mb-1 text-gray-700">Start Date</label>
                            <input
                                type="text"
                                placeholder="dd-mm-yyyy"
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={filter.startDate}
                                onChange={e => setFilter(f => ({ ...f, startDate: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col min-w-[140px] flex-1 md:max-w-xs">
                            <label className="font-semibold mb-1 text-gray-700">End Date</label>
                            <input
                                type="text"
                                placeholder="dd-mm-yyyy"
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={filter.endDate}
                                onChange={e => setFilter(f => ({ ...f, endDate: e.target.value }))}
                            />
                        </div>
                        <div className="flex flex-col flex-[2_2_200px] min-w-[200px]">
                            <label className="font-semibold mb-1 text-gray-700">Search</label>
                            <input
                                type="text"
                                placeholder="Search by asset name, personnel, or purpose"
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={filter.query}
                                onChange={e => setFilter(f => ({ ...f, query: e.target.value }))}
                            />
                        </div>
                        <div className="flex w-full justify-end gap-3 mt-5">
                            <button
                                className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                                onClick={() => setFilter({ base: 'All Bases', assetType: 'All Types', status: 'All Statuses', startDate: '', endDate: '', query: '' })}
                                type="button"
                            >
                                Reset
                            </button>
                            <button
                                className="px-6 py-2 bg-[#039BE5] rounded-lg text-white font-semibold hover:bg-[#0277BD]"
                                type="button"
                                onClick={() => setShowFilter(false)}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddForm && (
                <form onSubmit={handleAddSubmit} className="mb-6 bg-white p-6 rounded-xl shadow border border-gray-300">
                    <h2 className="text-xl font-bold mb-4">Add New Assignment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required className="border rounded px-3 py-2" placeholder="Asset" value={newData.asset} onChange={e => setNewData({ ...newData, asset: e.target.value })} />
                        <select required className="border rounded px-3 py-2" value={newData.assetType} onChange={e => setNewData({ ...newData, assetType: e.target.value })}>
                            <option value="">Select Asset Type</option>
                            {TYPES.filter(t => t !== 'All Types').map(t => <option key={t}>{t}</option>)}
                        </select>
                        <select required className="border rounded px-3 py-2" value={newData.base} onChange={e => setNewData({ ...newData, base: e.target.value })}>
                            <option value="">Select Base</option>
                            {BASES.filter(b => b !== 'All Bases').map(b => <option key={b}>{b}</option>)}
                        </select>
                        <input required type="text" className="border rounded px-3 py-2" placeholder="Assigned To (e.g. Squad Alpha)" value={newData.assignedTo} onChange={e => setNewData({ ...newData, assignedTo: e.target.value })} />
                        <input required type="number" min="1" className="border rounded px-3 py-2" placeholder="Quantity" value={newData.quantity} onChange={e => setNewData({ ...newData, quantity: e.target.value })} />
                        <input required type="number" min="0" className="border rounded px-3 py-2" placeholder="Returned" value={newData.returned} onChange={e => setNewData({ ...newData, returned: e.target.value })} />
                        <input required className="border rounded px-3 py-2 col-span-full" placeholder="Purpose" value={newData.purpose} onChange={e => setNewData({ ...newData, purpose: e.target.value })} />
                        <select required className="border rounded px-3 py-2" value={newData.status} onChange={e => setNewData({ ...newData, status: e.target.value })}>
                            <option value="">Select Status</option>
                            {STATUSES.filter(s => s !== 'All Statuses').map(s => <option key={s}>{s}</option>)}
                        </select>
                        <input required type="text" className="border rounded px-3 py-2" placeholder="Start Date (May 10, 2025)" value={newData.startDate} onChange={e => setNewData({ ...newData, startDate: e.target.value })} />
                        <input required type="text" className="border rounded px-3 py-2" placeholder="End Date (Aug 15, 2025)" value={newData.endDate} onChange={e => setNewData({ ...newData, endDate: e.target.value })} />
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                        <button type="button" className="px-4 py-2 border rounded" onClick={() => setShowAddForm(false)}>Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-md border border-gray-300 overflow-x-auto">
                <table className="w-full border-collapse min-w-[650px] text-left text-[13px] text-[#182233]">
                    <thead>
                        <tr className="bg-[#FAFAFB] text-[#181C32] font-bold border-b border-gray-300">
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">ASSET</th>
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">BASE</th>
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">ASSIGNED TO</th>
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">QUANTITY</th>
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">PURPOSE</th>
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">STATUS</th>
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">START DATE</th>
                            <th className="px-3 py-4 border-r border-gray-300 whitespace-nowrap ">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center p-4 text-gray-500">No assignments found.</td>
                            </tr>
                        ) : (
                            filtered.map((assignment, idx) => (
                                <tr className="border-b border-gray-100 hover:bg-[#F1FAFE]" key={idx}>
                                    <td className="px-3 py-4 border-r border-gray-300">
                                        <span className="block font-semibold text-blue-600 cursor-pointer hover:underline">{assignment.asset}</span>
                                        <span className="block text-[13px] text-gray-500 mt-1">{assignment.assetType}</span>
                                    </td>
                                    <td className="px-3 py-4 border-r border-gray-300">{assignment.base}</td>
                                    <td className="px-3 py-4 border-r border-gray-300">{assignment.assignedTo.split('<br/>').map((line, i) => <span key={i} className="block">{line}</span>)}</td>
                                    <td className="px-3 py-4 border-r border-gray-300">
                                        <div>
                                            <span>{assignment.quantity}</span>
                                            <span className="block text-xs text-gray-500">{assignment.returned} returned</span>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 border-r border-gray-300">{assignment.purpose}</td>
                                    <td className="px-3 py-4 border-r border-gray-300">
                                        <span className="inline-block bg-[#E8F2FF] text-blue-600 font-semibold rounded-full px-4 py-1 text-xs">{assignment.status}</span>
                                    </td>
                                    <td className="px-3 py-4 border-r border-gray-300">
                                        <span>{assignment.startDate}</span>
                                        <span className="block text-xs text-gray-500">to {assignment.endDate}</span>
                                    </td>
                                    <td className="px-3 py-4 text-right border-r border-gray-300">
                                        <button className="text-blue-600 font-semibold text-sm hover:underline cursor-pointer">View</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex flex-wrap justify-between items-center px-5 py-3 gap-3">
                    <span className="text-sm text-gray-700">
                        Showing 1 to {filtered.length} of {filtered.length} results
                    </span>
                    <div className="flex items-center gap-2">
                        <select className="border border-gray-300 rounded px-2 py-1 text-sm" disabled>
                            <option>10 per page</option>
                        </select>
                        <button className="px-2 py-1 rounded border border-gray-300 text-gray-900 disabled:opacity-50 cursor-not-allowed" disabled>&lt;</button>
                        <button className="px-3 py-1 rounded border border-blue-600 text-blue-600 font-bold bg-white">1</button>
                        <button className="px-2 py-1 rounded border border-gray-300 text-gray-900 disabled:opacity-50 cursor-not-allowed" disabled>&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
