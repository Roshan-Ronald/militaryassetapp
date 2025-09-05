import React, { useState } from 'react';

const defaultSettings = {
  systemName: 'Military Asset Management System',
  orgName: 'Department of Defense',
  currency: 'USD ($)',
  theme: 'Default',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12-hour (AM/PM)',
  timezone: 'Eastern Time (ET)',
  emailNotifications: true,
  version: '1.0.0',
  lastUpdated: '9/5/2025',
  databaseStatus: 'Connected',
  apiStatus: 'Operational',
};

const defaultAssetTypes = [
  'Weapon',
  'Ammunition',
  'Vehicle',
  'Medical',
  'Equipment',
  'Food',
];

const defaultBases = ['Base Alpha', 'Base Bravo', 'Base Charlie'];

const tabs = ["General", "Asset Types", "Bases", "System"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState(defaultSettings);
  const [assetTypes, setAssetTypes] = useState(defaultAssetTypes);
  const [assetInput, setAssetInput] = useState('');
  const [bases, setBases] = useState(defaultBases);
  const [baseInput, setBaseInput] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  function notify(msg) {
    alert(msg);
  }

  function handleAssetAdd() {
    if (assetInput && !assetTypes.includes(assetInput)) {
      setAssetTypes([...assetTypes, assetInput]);
      setAssetInput('');
    }
  }
  function handleAssetRemove(item) {
    setAssetTypes(assetTypes.filter((a) => a !== item));
  }
  function handleBaseAdd() {
    if (baseInput && !bases.includes(baseInput)) {
      setBases([...bases, baseInput]);
      setBaseInput('');
    }
  }
  function handleBaseRemove(item) {
    setBases(bases.filter((b) => b !== item));
  }
  function handleSystemSave() {
    notify('Settings saved successfully');
  }
  function handleSettingsSave(e) {
    e.preventDefault();
    notify('Settings saved successfully');
  }
  function handleToggleMaintenance() {
    setMaintenanceMode((x) => !x);
    notify(maintenanceMode ? 'Maintenance mode disabled' : 'Maintenance mode enabled');
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-7">Settings</h1>
        <div className="border-b border-gray-200 mb-3">
          <nav className="flex gap-8">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`pb-2 text-lg font-medium transition border-b-2 ${activeTab === i
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-500"
                  }`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div>
          {activeTab === 0 && (
            <form
              className="bg-white shadow rounded-xl px-10 py-7 max-w-4xl mx-auto"
              onSubmit={handleSettingsSave}
            >
              <div className="grid grid-cols-2 gap-x-10 gap-y-3 mb-6">
                <div>
                  <label className="block font-medium mb-1">System Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    value={settings.systemName}
                    onChange={e => setSettings({ ...settings, systemName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Organization Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    value={settings.orgName}
                    onChange={e => setSettings({ ...settings, orgName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Default Currency</label>
                  <select
                    className="w-full border border-gray-200 rounded-md py-2.5 px-2 bg-white"
                    value={settings.currency}
                    onChange={e => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Theme</label>
                  <select
                    className="w-full border border-gray-200 rounded-md py-2.5 px-2 bg-white"
                    value={settings.theme}
                    onChange={e => setSettings({ ...settings, theme: e.target.value })}
                  >
                    <option>Default</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Date Format</label>
                  <select
                    className="w-full border border-gray-200 rounded-md py-2.5 px-2 bg-white"
                    value={settings.dateFormat}
                    onChange={e => setSettings({ ...settings, dateFormat: e.target.value })}
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Time Format</label>
                  <select
                    className="w-full border border-gray-200 rounded-md py-2.5 px-2 bg-white"
                    value={settings.timeFormat}
                    onChange={e => setSettings({ ...settings, timeFormat: e.target.value })}
                  >
                    <option>12-hour (AM/PM)</option>
                    <option>24-hour</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Timezone</label>
                  <select
                    className="w-full border border-gray-200 rounded-md py-2.5 px-2 bg-white"
                    value={settings.timezone}
                    onChange={e => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <option>Eastern Time (ET)</option>
                    <option>GMT</option>
                    <option>Central Time (CT)</option>
                  </select>
                </div>
                <div className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="mr-2 w-4 h-4 accent-blue-600"
                  />
                  <label className="font-medium text-base">Enable email notifications</label>
                </div>
              </div>
              <button
                type="submit"
                className="float-right bg-blue-600 text-white rounded-md px-8 py-2 font-semibold text-base hover:bg-blue-700 transition"
              >
                Save Settings
              </button>
              <div className="clear-both"></div>
            </form>
          )}
          {activeTab === 1 && (
            <div className="bg-white shadow rounded-xl px-10 py-8">
              <h3 className="font-semibold text-xl mb-6">Asset Types</h3>
              <div className="flex items-center mb-4">
                <input
                  placeholder="Add new asset type"
                  className="border border-gray-200 rounded-md p-2 mr-3 w-72 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={assetInput}
                  onChange={e => setAssetInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAssetAdd(); } }}
                />
                <button
                  onClick={handleAssetAdd}
                  className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {assetTypes.map(type => (
                  <div
                    key={type}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-6 py-5 bg-white"
                  >
                    <span className="text-base">{type}</span>
                    <button
                      onClick={() => handleAssetRemove(type)}
                      className="text-red-600 font-medium outline-none focus:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className="bg-white shadow rounded-xl px-10 py-8">
              <h3 className="font-semibold text-xl mb-6">Bases</h3>
              <div className="flex items-center mb-4">
                <input
                  placeholder="Add new base"
                  className="border border-gray-200 rounded-md p-2 mr-3 w-72 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={baseInput}
                  onChange={e => setBaseInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleBaseAdd(); } }}
                />
                <button
                  onClick={handleBaseAdd}
                  className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {bases.map(base => (
                  <div
                    key={base}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-6 py-5 bg-white"
                  >
                    <span className="text-base">{base}</span>
                    <button
                      onClick={() => handleBaseRemove(base)}
                      className="text-red-600 font-medium outline-none focus:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <div className="bg-white shadow rounded-xl px-10 py-8 max-w-3xl mx-auto">
              <h3 className="font-semibold text-xl mb-6">System Settings</h3>
              <div className="mb-7 border border-gray-100 rounded-lg p-6 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-medium mb-1">Maintenance Mode</div>
                  <div className="text-gray-500 text-sm">When enabled, only administrators can access the system</div>
                </div>
                <button
                  onClick={handleToggleMaintenance}
                  className={`px-6 py-2 rounded font-semibold transition ${maintenanceMode ? "bg-gray-200 text-gray-800" : "bg-green-500 text-white hover:bg-green-600"}`}
                >
                  {maintenanceMode ? "Disable" : "Enable"}
                </button>
              </div>
              <h3 className="font-semibold text-lg mb-4 mt-8">System Information</h3>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="mb-4">
                    <div className="text-gray-500">Version</div>
                    <div className="font-semibold">{settings.version}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Database Status</div>
                    <span className="inline-block rounded-full bg-green-100 px-3 mt-1 py-1 text-green-800 font-medium text-sm">{settings.databaseStatus}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="text-gray-500">Last Updated</div>
                    <div className="font-semibold">{settings.lastUpdated}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">API Status</div>
                    <span className="inline-block rounded-full bg-green-100 px-3 mt-1 py-1 text-green-800 font-medium text-sm">{settings.apiStatus}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSystemSave}
                className="float-right bg-blue-600 text-white rounded-md px-8 py-2 font-semibold text-base hover:bg-blue-700 transition"
              >
                Save Settings
              </button>
              <div className="clear-both"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
