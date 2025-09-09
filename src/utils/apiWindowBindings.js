import * as api from '../Api';

const apiBindings = {
  getAssets: api.getAssets,
  createAsset: api.createAsset,
  updateAsset: api.updateAsset,
  deleteAsset: api.deleteAsset,
  getAssetById: api.getAssetById,
  getAssignments: api.getAssignments,
  createAssignment: api.createAssignment,
  getExpenditures: api.getExpenditures,
  createExpenditure: api.createExpenditure,
  getUserProfile: api.getUserProfile,
  updateUserProfile: api.updateUserProfile,
  getPurchases: api.getPurchases,
  createPurchase: api.createPurchase,
  updatePurchase: api.updatePurchase,
  deletePurchase: api.deletePurchase,
  getSettings: api.getSettings,
  saveSettings: api.saveSettings,
  getAssetTypes: api.getAssetTypes,
  saveAssetTypes: api.saveAssetTypes,
  getBases: api.getBases,
  saveBases: api.saveBases,
  getTransfers: api.getTransfers,
  createTransfer: api.createTransfer,
  updateTransfer: api.updateTransfer,
  deleteTransfer: api.deleteTransfer,
  getUsers: api.getUsers,
  createUser: api.createUser,
  updateUser: api.updateUser,
  deleteUser: api.deleteUser,
};

// Function to bind all api functions to window
export function bindApiToWindow() {
  Object.entries(apiBindings).forEach(([key, func]) => {
    window[key] = func;
  });
}
