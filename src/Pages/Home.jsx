import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col, Card, Statistic, Select, DatePicker, Spin, Table, Tag } from 'antd'
import moment from 'moment'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import {
  AppstoreOutlined,
  LineChartOutlined,
  TeamOutlined,
  FireOutlined,
} from '@ant-design/icons'


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
)


const { RangePicker } = DatePicker


export default function Home() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalAssets: 0, available: 0, assigned: 0, expended: 0 })
  const [pieData, setPieData] = useState({ labels: [], datasets: [] })
  const [barData, setBarData] = useState({ labels: [], datasets: [] })
  const [transfers, setTransfers] = useState([])
  const [purchases, setPurchases] = useState([])
  const [assignments, setAssignments] = useState([])
  const [expenditures, setExpenditures] = useState([])
  const [filters, setFilters] = useState({ base: 'all', assetType: 'all', dateRange: [] })


  const baseOptions = [
    { label: 'All Bases', value: 'all' },
    { label: 'Base Alpha', value: 'Base Alpha' },
    { label: 'Base Bravo', value: 'Base Bravo' },
    { label: 'Base Charlie', value: 'Base Charlie' },
  ]
  const assetTypeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Weapon', value: 'Weapon' },
    { label: 'Vehicle', value: 'Vehicle' },
    { label: 'Ammunition', value: 'Ammunition' },
  ]


  useEffect(() => {
    setLoading(true)


    const storedStats = {
      totalAssets: 14,
      available: 11230,
      assigned: 0,
      expended: 1000,
    }
    const storedPieData = [
      { type: 'Weapon', value: 10 },
      { type: 'Vehicle', value: 3 },
      { type: 'Ammunition', value: 1 },
    ]
    const storedBarData = [
      { type: 'Weapon', available: 1120, assigned: 0 },
      { type: 'Vehicle', available: 1000, assigned: 0 },
      { type: 'Ammunition', available: 9000, assigned: 0 },
    ]
    const storedTransfers = [
      { asset: 'vhvh', from: 'Base Charlie', to: 'Base Alpha', quantity: 1, assetType: 'Vehicle' },
      { asset: '5.56mm Ammunition', from: 'Base Bravo', to: 'Base Charlie', quantity: 1, assetType: 'Ammunition' },
      { asset: 'A16', from: 'Base Alpha', to: 'Base Charlie', quantity: 1, assetType: 'Weapon' },
      { asset: 'M4 Rifle', from: 'Base Alpha', to: 'Base Bravo', quantity: 10, assetType: 'Weapon' },
    ]
    const storedPurchases = [
      { asset: 'nn', base: 'Base Bravo', quantity: 2, status: 'Delivered', assetType: 'Weapon' },
      { asset: 'M4 Rifle', base: 'Base Alpha', quantity: 20, status: 'Delivered', assetType: 'Weapon' },
    ]
    const storedAssignments = [
      { asset: 'M4 Rifle', assignedTo: 'Squad Alpha', quantity: 20, status: 'Returned', assetType: 'Weapon' },
    ]
    const storedExpenditures = [
      { asset: '5.56mm Ammunition', reason: 'Training', quantity: 1000, date: 'May 10, 2025', assetType: 'Ammunition' },
    ]


    setStats(storedStats)
    setPieData({
      labels: storedPieData.map(i => i.type),
      datasets: [
        {
          label: 'Assets by Type',
          data: storedPieData.map(i => i.value),
          backgroundColor: ['#3366FF', '#28B463', '#F5B041'],
        },
      ],
    })
    setBarData({
      labels: storedBarData.map(i => i.type),
      datasets: [
        { label: 'Available', data: storedBarData.map(i => i.available), backgroundColor: '#28B463' },
        { label: 'Assigned', data: storedBarData.map(i => i.assigned), backgroundColor: '#F5B041' },
      ],
    })
    setTransfers(storedTransfers)
    setPurchases(storedPurchases)
    setAssignments(storedAssignments)
    setExpenditures(storedExpenditures)


    setLoading(false)
  }, [])


  const filterByBase = (item) => {
    if (!filters.base || filters.base.toLowerCase() === 'all') return true
    const baseFilter = filters.base.toLowerCase()
    return (
      (item.base && item.base.toLowerCase() === baseFilter) ||
      (item.from && item.from.toLowerCase() === baseFilter) ||
      (item.to && item.to.toLowerCase() === baseFilter) ||
      (item.assignedTo && item.assignedTo.toLowerCase() === baseFilter)
    )
  }


  const filterByAssetType = (item) => {
    if (!filters.assetType || filters.assetType.toLowerCase() === 'all') return true
    const assetTypeFilter = filters.assetType.toLowerCase()
    if (item.assetType && item.assetType.toLowerCase() === assetTypeFilter) return true
    if (typeof item.asset === 'string' && item.asset.toLowerCase().includes(assetTypeFilter)) return true
    return false
  }


  const filterByDateRange = (item) => {
    if (!filters.dateRange || filters.dateRange.length !== 2) return true
    if (!item.date) return true
    const start = filters.dateRange[0].startOf('day')
    const end = filters.dateRange[1].endOf('day')
    const itemDate = moment(item.date, ['MMM D, YYYY', 'DD-MM-YYYY', moment.ISO_8601], true).startOf('day')
    if (!itemDate.isValid()) return true
    return itemDate.isBetween(start, end, null, '[]')
  }


  const filteredTransfers = useMemo(
    () => transfers.filter(t => filterByBase(t) && filterByAssetType(t)),
    [filters.base, filters.assetType, transfers]
  )
  const filteredPurchases = useMemo(
    () => purchases.filter(p => filterByBase(p) && filterByAssetType(p)),
    [filters.base, filters.assetType, purchases]
  )
  const filteredAssignments = useMemo(
    () => assignments.filter(a => filterByBase(a) && filterByAssetType(a)),
    [filters.base, filters.assetType, assignments]
  )
  const filteredExpenditures = useMemo(
    () => expenditures.filter(e => filterByBase(e) && filterByAssetType(e) && filterByDateRange(e)),
    [filters.base, filters.assetType, filters.dateRange, expenditures]
  )


  const filteredStats = useMemo(() => {
    const expendedQuantity = filteredExpenditures.reduce((sum, e) => sum + (e.quantity || 0), 0)
    const assignedQuantity = filteredAssignments.reduce((sum, a) => sum + (a.quantity || 0), 0)
    const availableQuantity =
      filteredTransfers.reduce((sum, t) => sum + (t.quantity || 0), 0) +
      filteredPurchases.reduce((sum, p) => sum + (p.quantity || 0), 0) -
      assignedQuantity -
      expendedQuantity
    const totalAssetsCalc = availableQuantity + assignedQuantity + expendedQuantity
    return {
      totalAssets: totalAssetsCalc,
      available: availableQuantity,
      assigned: assignedQuantity,
      expended: expendedQuantity,
    }
  }, [filteredTransfers, filteredPurchases, filteredAssignments, filteredExpenditures])


  const filteredPieData = useMemo(() => {
    const counts = {}
      ;[...filteredTransfers, ...filteredPurchases, ...filteredAssignments, ...filteredExpenditures].forEach((item) => {
        const key = item.assetType || 'Other'
        counts[key] = (counts[key] || 0) + (item.quantity || 1)
      })
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Assets by Type',
          data: Object.values(counts),
          backgroundColor: ['#3366FF', '#28B463', '#F5B041', '#CCCCCC'].slice(0, Object.keys(counts).length),
        },
      ],
    }
  }, [filteredTransfers, filteredPurchases, filteredAssignments, filteredExpenditures])


  const filteredBarData = useMemo(() => {
    const availableMap = {}
    const assignedMap = {}
      ;[...filteredTransfers, ...filteredPurchases].forEach((item) => {
        const key = item.assetType || 'Other'
        availableMap[key] = (availableMap[key] || 0) + (item.quantity || 0)
      })
    filteredAssignments.forEach((item) => {
      const key = item.assetType || 'Other'
      assignedMap[key] = (assignedMap[key] || 0) + (item.quantity || 0)
    })
    const labels = Array.from(new Set([...Object.keys(availableMap), ...Object.keys(assignedMap)]))
    const availableData = labels.map((l) => availableMap[l] || 0)
    const assignedData = labels.map((l) => assignedMap[l] || 0)
    return {
      labels,
      datasets: [
        { label: 'Available', data: availableData, backgroundColor: '#28B463' },
        { label: 'Assigned', data: assignedData, backgroundColor: '#F5B041' },
      ],
    }
  }, [filteredTransfers, filteredPurchases, filteredAssignments])


  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  }


  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: { y: { beginAtZero: true } },
  }


  const columns = {
    transfers: [
      { title: 'ASSET', dataIndex: 'asset', key: 'asset', fixed: 'left', width: 150 },
      { title: 'FROM', dataIndex: 'from', key: 'from', width: 130 },
      { title: 'TO', dataIndex: 'to', key: 'to', width: 130 },
      { title: 'QUANTITY', dataIndex: 'quantity', key: 'quantity', width: 100 },
    ],
    purchases: [
      { title: 'ASSET', dataIndex: 'asset', key: 'asset', width: 150 },
      { title: 'BASE', dataIndex: 'base', key: 'base', width: 130 },
      { title: 'QUANTITY', dataIndex: 'quantity', key: 'quantity', width: 100 },
      {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (val) => <Tag color="green">{val}</Tag>,
      },
    ],
    assignments: [
      { title: 'ASSET', dataIndex: 'asset', key: 'asset', width: 150 },
      { title: 'ASSIGNED TO', dataIndex: 'assignedTo', key: 'assignedTo', width: 140 },
      { title: 'QUANTITY', dataIndex: 'quantity', key: 'quantity', width: 100 },
      {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (val) => <Tag color="blue">{val}</Tag>,
      },
    ],
    expenditures: [
      { title: 'ASSET', dataIndex: 'asset', key: 'asset', width: 150 },
      { title: 'REASON', dataIndex: 'reason', key: 'reason', width: 180 },
      { title: 'QUANTITY', dataIndex: 'quantity', key: 'quantity', width: 100 },
      { title: 'DATE', dataIndex: 'date', key: 'date', width: 130 },
    ],
  }


  const { transfers: columnsTransfers, purchases: columnsPurchases, assignments: columnsAssignments, expenditures: columnsExpenditures } = columns


  const handleBaseChange = (value) => setFilters(f => ({ ...f, base: value || 'all' }))
  const handleAssetTypeChange = (value) => setFilters(f => ({ ...f, assetType: value || 'all' }))
  const handleDateRangeChange = (dates) => setFilters(f => ({ ...f, dateRange: dates || [] }))


  return (
    <Spin spinning={loading}>
      <div className="p-6 mx-auto rounded-lg max-w-7xl">
        <h1 className="mb-6 font-semibold text-2xl">Dashboard</h1>


        <div className="flex flex-wrap gap-6 items-center bg-white p-4 rounded-xl mb-6 shadow-md">
          <div className="flex flex-col gap-1 min-w-[180px] flex-1">
            <label className="font-semibold text-sm text-gray-800">Base</label>
            <Select
              className="w-full rounded-md border border-gray-300 bg-gray-50"
              options={baseOptions}
              value={filters.base}
              onChange={handleBaseChange}
              showSearch
              placeholder="Select Base"
              popupClassName="custom-select-dropdown"
              allowClear
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[180px] flex-1">
            <label className="font-semibold text-sm text-gray-800">Asset Type</label>
            <Select
              className="w-full rounded-md border border-gray-300 bg-gray-50"
              options={assetTypeOptions}
              value={filters.assetType}
              onChange={handleAssetTypeChange}
              showSearch
              placeholder="Select Asset Type"
              popupClassName="custom-select-dropdown"
              allowClear
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[280px] flex-1">
            <label className="font-semibold text-sm text-gray-800">Date Range</label>
            <RangePicker
              format="DD-MM-YYYY"
              className="w-full rounded-md border border-gray-300 bg-gray-50"
              onChange={handleDateRangeChange}
              value={filters.dateRange}
              allowClear
            />
          </div>
        </div>


        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-2xl shadow-sm min-h-28">
              <div className="flex gap-3 items-center">
                <div className="bg-blue-600 rounded-lg w-12 h-12 flex items-center justify-center">
                  <AppstoreOutlined className="text-white text-2xl" />
                </div>
                <Statistic title="Total Assets" value={filteredStats.totalAssets} valueStyle={{ color: '#3366FF', fontWeight: 700 }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-2xl shadow-sm min-h-28">
              <div className="flex gap-3 items-center">
                <div className="bg-green-600 rounded-lg w-12 h-12 flex items-center justify-center">
                  <LineChartOutlined className="text-white text-2xl" />
                </div>
                <Statistic title="Available" value={filteredStats.available} valueStyle={{ color: '#28B463', fontWeight: 700 }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-2xl shadow-sm min-h-28">
              <div className="flex gap-3 items-center">
                <div className="bg-yellow-400 rounded-lg w-12 h-12 flex items-center justify-center">
                  <TeamOutlined className="text-white text-2xl" />
                </div>
                <Statistic title="Assigned" value={filteredStats.assigned} valueStyle={{ color: '#F5B041', fontWeight: 700 }} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-2xl shadow-sm min-h-28">
              <div className="flex gap-3 items-center">
                <div className="bg-red-700 rounded-lg w-12 h-12 flex items-center justify-center">
                  <FireOutlined className="text-white text-2xl" />
                </div>
                <Statistic title="Expended" value={filteredStats.expended} valueStyle={{ color: '#CB4335', fontWeight: 700 }} />
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={24} className="mb-10">
          <Col span={12} className="w-full md:w-1/2">
            <Card
              title="Assets by Type"
              className="h-[450px] rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-[320px] md:h-[320px]">
                <Pie data={filteredPieData} options={pieOptions} />
              </div>
            </Card>
          </Col>
          <Col span={12} className="w-full md:w-1/2">
            <Card
              title="Asset Availability"
              className="h-[450px] rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-[320px] md:h-[320px]">
                <Bar data={filteredBarData} options={barOptions} />
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={[24, 24]} className="mb-10">
          <Col xs={24} md={12}>
            <Card title="Recent Transfers" extra={<a href="/transfers" className="text-blue-600 hover:underline">View all</a>} className="rounded-xl shadow-md" style={{ minHeight: 300 }}>
              <Table dataSource={filteredTransfers} columns={columnsTransfers} size="middle" pagination={false} scroll={{ x: 600 }} rowKey={(r, i) => i} bordered />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Recent Purchases" extra={<a href="/purchases" className="text-blue-600 hover:underline">View all</a>} className="rounded-xl shadow-md" style={{ minHeight: 300 }}>
              <Table dataSource={filteredPurchases} columns={columnsPurchases} size="middle" pagination={false} scroll={{ x: 600 }} rowKey={(r, i) => i} bordered />
            </Card>
          </Col>
        </Row>


        <Row gutter={[24, 24]} className="mb-10">
          <Col xs={24} md={12}>
            <Card title="Recent Assignments" extra={<a href="/assignments" className="text-blue-600 hover:underline">View all</a>} className="rounded-xl shadow-md" style={{ minHeight: 300 }}>
              <Table dataSource={filteredAssignments} columns={columnsAssignments} size="middle" pagination={false} scroll={{ x: 600 }} rowKey={(r, i) => i} bordered />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Recent Expenditures" extra={<a href="/expenditures" className="text-blue-600 hover:underline">View all</a>} className="rounded-xl shadow-md" style={{ minHeight: 300 }}>
              <Table dataSource={filteredExpenditures} columns={columnsExpenditures} size="middle" pagination={false} scroll={{ x: 600 }} rowKey={(r, i) => i} bordered />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  )
}