// Assets API
const STORAGE_ASSETS_KEY = "assetsData";

export async function getAssets() {
  const data = localStorage.getItem(STORAGE_ASSETS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getAssetById(id) {
  const assets = await getAssets();
  return assets.find(a => String(a.id) === String(id)) || null;
}

export async function createAsset(asset) {
  const assets = await getAssets();
  assets.unshift(asset);
  localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(assets));
  return asset;
}

export async function updateAsset(id, updatedAsset) {
  const assets = await getAssets();
  const index = assets.findIndex(a => String(a.id) === String(id));
  if (index === -1) throw new Error("Asset not found");
  assets[index] = { ...assets[index], ...updatedAsset };
  localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(assets));
  return assets[index];
}

export async function deleteAsset(id) {
  const assets = await getAssets();
  const filteredAssets = assets.filter(a => String(a.id) !== String(id));
  if (filteredAssets.length === assets.length) throw new Error("Asset not found");
  localStorage.setItem(STORAGE_ASSETS_KEY, JSON.stringify(filteredAssets));
  return true;
}

// Transfers API
const STORAGE_TRANSFERS_KEY = "transfersData";

export async function getTransfers() {
  const data = localStorage.getItem(STORAGE_TRANSFERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getTransferById(id) {
  const transfers = await getTransfers();
  return transfers.find(t => String(t.id) === String(id)) || null;
}

export async function createTransfer(transfer) {
  const transfers = await getTransfers();
  transfers.unshift(transfer);
  localStorage.setItem(STORAGE_TRANSFERS_KEY, JSON.stringify(transfers));
  return transfer;
}

export async function updateTransfer(id, updatedTransfer) {
  const transfers = await getTransfers();
  const index = transfers.findIndex(t => String(t.id) === String(id));
  if (index === -1) throw new Error("Transfer not found");
  transfers[index] = { ...transfers[index], ...updatedTransfer };
  localStorage.setItem(STORAGE_TRANSFERS_KEY, JSON.stringify(transfers));
  return transfers[index];
}

export async function deleteTransfer(id) {
  const transfers = await getTransfers();
  const filtered = transfers.filter(t => String(t.id) !== String(id));
  if (filtered.length === transfers.length) throw new Error("Transfer not found");
  localStorage.setItem(STORAGE_TRANSFERS_KEY, JSON.stringify(filtered));
  return true;
}

// Purchases API
const STORAGE_PURCHASES_KEY = "purchasesData";

export async function getPurchases() {
  const data = localStorage.getItem(STORAGE_PURCHASES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getPurchaseById(id) {
  const purchases = await getPurchases();
  return purchases.find(p => String(p.id) === String(id)) || null;
}

export async function createPurchase(purchase) {
  const purchases = await getPurchases();
  purchases.unshift(purchase);
  localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(purchases));
  return purchase;
}

export async function updatePurchase(id, updatedPurchase) {
  const purchases = await getPurchases();
  const index = purchases.findIndex(p => String(p.id) === String(id));
  if (index === -1) throw new Error("Purchase not found");
  purchases[index] = { ...purchases[index], ...updatedPurchase };
  localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(purchases));
  return purchases[index];
}

export async function deletePurchase(id) {
  const purchases = await getPurchases();
  const filtered = purchases.filter(p => String(p.id) !== String(id));
  if (filtered.length === purchases.length) throw new Error("Purchase not found");
  localStorage.setItem(STORAGE_PURCHASES_KEY, JSON.stringify(filtered));
  return true;
}

// Assignments API
const STORAGE_ASSIGNMENTS_KEY = "assignmentsData";

export async function getAssignments() {
  const data = localStorage.getItem(STORAGE_ASSIGNMENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getAssignmentById(id) {
  const assignments = await getAssignments();
  return assignments.find(a => String(a.id) === String(id)) || null;
}

export async function createAssignment(assignment) {
  const assignments = await getAssignments();
  assignments.unshift(assignment);
  localStorage.setItem(STORAGE_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  return assignment;
}

export async function updateAssignment(id, updatedAssignment) {
  const assignments = await getAssignments();
  const index = assignments.findIndex(a => String(a.id) === String(id));
  if (index === -1) throw new Error("Assignment not found");
  assignments[index] = { ...assignments[index], ...updatedAssignment };
  localStorage.setItem(STORAGE_ASSIGNMENTS_KEY, JSON.stringify(assignments));
  return assignments[index];
}

export async function deleteAssignment(id) {
  const assignments = await getAssignments();
  const filteredAssignments = assignments.filter(a => String(a.id) !== String(id));
  if (filteredAssignments.length === assignments.length) throw new Error("Assignment not found");
  localStorage.setItem(STORAGE_ASSIGNMENTS_KEY, JSON.stringify(filteredAssignments));
  return true;
}

// Expenditures API
const STORAGE_EXPENDITURES_KEY = "expendituresData";

export async function getExpenditures() {
  const data = localStorage.getItem(STORAGE_EXPENDITURES_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getExpenditureById(id) {
  const expenditures = await getExpenditures();
  return expenditures.find(e => String(e.id) === String(id)) || null;
}

export async function createExpenditure(expenditure) {
  const expenditures = await getExpenditures();
  expenditures.unshift(expenditure);
  localStorage.setItem(STORAGE_EXPENDITURES_KEY, JSON.stringify(expenditures));
  return expenditure;
}

export async function updateExpenditure(id, updatedExpenditure) {
  const expenditures = await getExpenditures();
  const index = expenditures.findIndex(e => String(e.id) === String(id));
  if (index === -1) throw new Error("Expenditure not found");
  expenditures[index] = { ...expenditures[index], ...updatedExpenditure };
  localStorage.setItem(STORAGE_EXPENDITURES_KEY, JSON.stringify(expenditures));
  return expenditures[index];
}

export async function deleteExpenditure(id) {
  const expenditures = await getExpenditures();
  const filteredExpenditures = expenditures.filter(e => String(e.id) !== String(id));
  if (filteredExpenditures.length === expenditures.length) throw new Error("Expenditure not found");
  localStorage.setItem(STORAGE_EXPENDITURES_KEY, JSON.stringify(filteredExpenditures));
  return true;
}

// Users API
const STORAGE_USERS_KEY = "usersData";

export async function getUsers() {
  const data = localStorage.getItem(STORAGE_USERS_KEY);
  return data ? JSON.parse(data) : [
    { name: "System Administrator", username: "admin", email: "admin@example.com", role: "Admin", base: "N/A", status: "Active" },
    { name: "Base Commander Alpha", username: "commander1", email: "commander1@example.com", role: "Base Commander", base: "Base Alpha", status: "Active" },
    { name: "Base Commander Bravo", username: "commander2", email: "commander2@example.com", role: "Base Commander", base: "Bravo", status: "Active" },
    { name: "Logistics Officer 1", username: "logistics1", email: "logistics1@example.com", role: "Logistics Officer", base: "Base Alpha", status: "Active" },
    { name: "Logistics Officer 2", username: "logistics2", email: "logistics2@example.com", role: "Admin", base: "Bravo", status: "Active" },
    { name: "System Administrator", username: "gangad", email: "gangad@gmail.com", role: "Admin", base: "N/A", status: "Active" },
    { name: "System Administrator", username: "dharan", email: "dharan@gmail.com", role: "Admin", base: "N/A", status: "Active" },
    { name: "ram", username: "ram", email: "ram@gmail.com", role: "Logistics Officer", base: "Base Alpha", status: "Active" }
  ];
}

export async function createUser(user) {
  const users = await getUsers();
  users.unshift(user);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  return user;
}

export async function updateUser(username, updatedUser) {
  const users = await getUsers();
  const index = users.findIndex(u => u.username === username);
  if (index === -1) throw new Error("User not found");
  users[index] = { ...users[index], ...updatedUser };
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  return users[index];
}

export async function deleteUser(username) {
  const users = await getUsers();
  const filtered = users.filter(u => u.username !== username);
  if (filtered.length === users.length) throw new Error("User not found");
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(filtered));
  return true;
}

// Settings API
const STORAGE_SETTINGS_KEY = "appSettings";
const STORAGE_ASSETTYPES_KEY = "assetTypes";
const STORAGE_BASES_KEY = "bases";

export async function getSettings() {
  const data = localStorage.getItem(STORAGE_SETTINGS_KEY);
  return data ? JSON.parse(data) : {
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
    databaseStatus: 'Disconnected',
    apiStatus: '------'
  };
}

export async function saveSettings(settings) {
  localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}

export async function getAssetTypes() {
  const data = localStorage.getItem(STORAGE_ASSETTYPES_KEY);
  return data ? JSON.parse(data) : [
    'Weapon',
    'Ammunition',
    'Vehicle',
    'Medical',
    'Equipment',
    'Food'
  ];
}

export async function saveAssetTypes(assetTypes) {
  localStorage.setItem(STORAGE_ASSETTYPES_KEY, JSON.stringify(assetTypes));
  return assetTypes;
}

export async function getBases() {
  const data = localStorage.getItem(STORAGE_BASES_KEY);
  return data ? JSON.parse(data) : ['Base Alpha', 'Base Bravo', 'Base Charlie'];
}

export async function saveBases(bases) {
  localStorage.setItem(STORAGE_BASES_KEY, JSON.stringify(bases));
  return bases;
}

// User Profile API
const STORAGE_PROFILE_KEY = "userProfileData";

export async function getUserProfile() {
  const data = localStorage.getItem(STORAGE_PROFILE_KEY);
  return data ? JSON.parse(data) : {
    fullName: "Roshan Ronald",
    username: "roshanronald",
    email: "roshanronald@gmail.com",
    role: "Admin",
    accountStatus: "Active"
  };
}

export async function updateUserProfile(profile) {
  localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}


// Notifications API
const STORAGE_NOTIFICATIONS_KEY = "notificationsData";

export async function getNotifications() {
  const data = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
  const notifications = data ? JSON.parse(data) : [];

  const now = Date.now();
  const filtered = notifications.filter(n => now - new Date(n.date).getTime() <= 60000); 
  localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(filtered));

  return filtered;
}

export async function createNotification(notification) {
  const notifications = await getNotifications();
  const newNotification = {
    id: Date.now(),
    ...notification,
    date: new Date().toISOString()
  };
  notifications.unshift(newNotification);
  localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return newNotification;
}

export async function deleteNotification(id) {
  const notifications = await getNotifications();
  const filtered = notifications.filter(n => String(n.id) !== String(id));
  localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(filtered));
  return true;
}

export async function clearNotifications() {
  localStorage.removeItem(STORAGE_NOTIFICATIONS_KEY);
  return true;
}

setInterval(() => {
  getNotifications(); 
}, 60000);
