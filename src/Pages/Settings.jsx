import React, { useState, useEffect } from "react";
import {
  getSettings,
  saveSettings,
  getAssetTypes,
  saveAssetTypes,
  getBases,
  saveBases,
} from "../Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabs = ["General", "Asset Types", "Bases", "System"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState(null);
  const [assetTypes, setAssetTypes] = useState([]);
  const [assetInput, setAssetInput] = useState("");
  const [bases, setBases] = useState([]);
  const [baseInput, setBaseInput] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const s = await getSettings();
      const at = await getAssetTypes();
      const bs = await getBases();
      setSettings(s);
      setAssetTypes(at);
      setBases(bs);
    }
    fetchData();
  }, []);

  async function handleAssetAdd() {
    if (assetInput && !assetTypes.includes(assetInput)) {
      const newAssetTypes = [...assetTypes, assetInput];
      setAssetTypes(newAssetTypes);
      await saveAssetTypes(newAssetTypes);
      setAssetInput("");
      toast.success("Asset type added successfully");
    }
  }

  async function handleAssetRemove(item) {
    const newAssetTypes = assetTypes.filter((a) => a !== item);
    setAssetTypes(newAssetTypes);
    await saveAssetTypes(newAssetTypes);
    toast.info("Asset type removed");
  }

  async function handleBaseAdd() {
    if (baseInput && !bases.includes(baseInput)) {
      const newBases = [...bases, baseInput];
      setBases(newBases);
      await saveBases(newBases);
      setBaseInput("");
      toast.success("Base added successfully");
    }
  }

  async function handleBaseRemove(item) {
    const newBases = bases.filter((b) => b !== item);
    setBases(newBases);
    await saveBases(newBases);
    toast.info("Base removed");
  }

  async function handleSettingsSave(e) {
    e.preventDefault();
    await saveSettings(settings);
    toast.success("Settings saved successfully");
  }

  async function handleToggleMaintenance() {
    setMaintenanceMode((x) => !x);
    toast.info(
      maintenanceMode ? "Maintenance mode disabled" : "Maintenance mode enabled"
    );
  }

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-7">Settings</h1>
        <div className="border-b border-gray-200 mb-3">
          <nav className="flex gap-8 overflow-auto">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`whitespace-nowrap pb-2 px-4 text-lg font-medium transition border-b-2 ${
                  activeTab === i
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
              className="bg-white shadow p-6 rounded-lg max-w-4xl mx-auto"
              onSubmit={handleSettingsSave}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    System Name
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.systemName}
                    onChange={(e) =>
                      setSettings({ ...settings, systemName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Organization Name
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.orgName}
                    onChange={(e) =>
                      setSettings({ ...settings, orgName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Default Currency
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.currency}
                    onChange={(e) =>
                      setSettings({ ...settings, currency: e.target.value })
                    }
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.theme}
                    onChange={(e) =>
                      setSettings({ ...settings, theme: e.target.value })
                    }
                  >
                    <option>Default</option>
                    <option>Dark</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Date Format
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.dateFormat}
                    onChange={(e) =>
                      setSettings({ ...settings, dateFormat: e.target.value })
                    }
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Time Format
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.timeFormat}
                    onChange={(e) =>
                      setSettings({ ...settings, timeFormat: e.target.value })
                    }
                  >
                    <option>12-hour (AM/PM)</option>
                    <option>24-hour</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.timezone}
                    onChange={(e) =>
                      setSettings({ ...settings, timezone: e.target.value })
                    }
                  >
                    <option>Eastern Time (ET)</option>
                    <option>GMT</option>
                    <option>Central Time (CT)</option>
                  </select>
                </div>
                <div className="flex items-center mt-6 col-span-full">
                  <input
                    type="checkbox"
                    className="mr-4"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        emailNotifications: e.target.checked,
                      })
                    }
                  />
                  <label className="text-gray-700 font-medium select-none">
                    Enable email notifications
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="ml-auto block cursor-pointer bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
            </form>
          )}
          {activeTab === 1 && (
            <div className="bg-white shadow p-6 rounded-lg max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Asset Types</h2>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded px-3 py-2"
                  placeholder="Add new asset type"
                  value={assetInput}
                  onChange={(e) => setAssetInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAssetAdd();
                    }
                  }}
                />
                <button
                  className="bg-blue-600 text-white px-4 cursor-pointer py-2 rounded hover:bg-blue-700"
                  onClick={handleAssetAdd}
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {assetTypes.map((asset) => (
                  <div
                    key={asset}
                    className="flex justify-between items-center border rounded px-4 py-2"
                  >
                    <span>{asset}</span>
                    <button
                      className="text-red-500 cursor-pointer hover:underline"
                      onClick={() => handleAssetRemove(asset)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className="bg-white shadow p-6 rounded-lg max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Bases</h2>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded px-3 py-2"
                  placeholder="Add new base"
                  value={baseInput}
                  onChange={(e) => setBaseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleBaseAdd();
                    }
                  }}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
                  onClick={handleBaseAdd}
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bases.map((base) => (
                  <div
                    key={base}
                    className="flex justify-between items-center border rounded px-4 py-2"
                  >
                    <span>{base}</span>
                    <button
                      className="text-red-500 hover:underline cursor-pointer"
                      onClick={() => handleBaseRemove(base)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 3 && (
            <div className="bg-white shadow p-6 rounded-lg max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-6">System</h2>
              <div className="flex items-center justify-between mb-6 border rounded p-4 bg-gray-50">
                <div>
                  <h3 className="text-lg font-medium mb-1">Maintenance Mode</h3>
                  <p className="text-gray-600 text-sm">
                    When enabled, only administrators can access the system
                  </p>
                </div>
                <button
                  className={`px-6 py-2 rounded font-semibold ${
                    maintenanceMode
                      ? "bg-gray-300 text-gray-800"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  onClick={handleToggleMaintenance}
                >
                  {maintenanceMode ? "Disable" : "Enable"}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Version</p>
                  <p className="text-gray-900 font-semibold">
                    {settings.version}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Database Status</p>
                  <p className="inline-block rounded-full px-3 py-1 bg-red-100 text-red-700 font-semibold text-sm">
                    {settings.databaseStatus}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Last Updated</p>
                  <p className="text-gray-900 font-semibold">
                    {settings.lastUpdated}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">API Status</p>
                  <p className="inline-block rounded-full px-3 py-1 bg-red-100 text-red-700 font-semibold text-sm">
                    {settings.apiStatus}
                  </p>
                </div>
              </div>
              <button
                className="ml-auto block bg-blue-600 cursor-pointer text-white px-8 py-3 rounded hover:bg-blue-700 transition"
                onClick={handleSettingsSave}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
