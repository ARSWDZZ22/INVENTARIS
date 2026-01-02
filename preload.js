// Minimal preload; expose safe APIs if needed later
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // placeholder for secure native APIs
});
