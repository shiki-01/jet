const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
	send: (channel, data) => {
		ipcRenderer.send(channel, data);
	},
	sendSync: (channel, data) => {
		ipcRenderer.sendSync(channel, data);
	},
	receive: (channel, func) => {
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	},
	window: {
		close: () => ipcRenderer.send('window-close'),
		minimize: () => ipcRenderer.send('window-minimize'),
		maximize: () => ipcRenderer.send('window-maximize'),
	},
	project: {
		get: async () => await ipcRenderer.invoke('get-project'),
		getData: async (filePath) => await ipcRenderer.invoke('get-project-data', filePath),
		getFile: async (filePath) => await ipcRenderer.invoke('get-file', filePath),
		saveFile: async (filePath, data) => await ipcRenderer.invoke('save-file', filePath, data),
		createFile: async (fileName) => await ipcRenderer.invoke('create-file', fileName),
		createFolder: async (folderName) => await ipcRenderer.invoke('create-folder', folderName),
	},
});
