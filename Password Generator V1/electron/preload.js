const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getTotpSetup: () => ipcRenderer.invoke('get-totp-setup'),
  verifyTotpSetup: (secret, token) => ipcRenderer.invoke('verify-totp-setup', secret, token),
  verifyTotpLogin: (token) => ipcRenderer.invoke('verify-totp-login', token),
  getPasswords: () => ipcRenderer.invoke('get-passwords'),
  addPassword: (site, username, password) => ipcRenderer.invoke('add-password', site, username, password),
  deletePassword: (id) => ipcRenderer.invoke('delete-password', id),
})
