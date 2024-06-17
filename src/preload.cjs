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
	},
});
