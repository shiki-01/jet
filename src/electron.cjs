const windowStateManager = require('electron-window-state');
const { app, BrowserWindow, ipcMain } = require('electron');
const contextMenu = require('electron-context-menu');
const serve = require('electron-serve');
const path = require('path');
const fs = require('fs');

try {
	require('electron-reloader')(module);
} catch (e) {
	console.error(e);
}

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const dev = !app.isPackaged;
let mainWindow;

function createWindow() {
	let windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600,
	});

	const mainWindow = new BrowserWindow({
		backgroundColor: 'whitesmoke',
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		trafficLightPosition: {
			x: 17,
			y: 32,
		},
		minHeight: 450,
		minWidth: 500,
		webPreferences: {
			enableRemoteModule: true,
			contextIsolation: true,
			nodeIntegration: true,
			spellcheck: false,
			devTools: dev,
			preload: path.join(__dirname, 'preload.cjs'),
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
	});

	windowState.manage(mainWindow);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

	mainWindow.on('close', () => {
		windowState.saveState(mainWindow);
	});

	return mainWindow;
}

contextMenu({
	showLookUpSelection: false,
	showSearchWithGoogle: false,
	showCopyImage: false,
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Make App 💻',
		},
	],
});

function loadVite(port) {
	mainWindow.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	mainWindow = createWindow();
	mainWindow.once('close', () => {
		mainWindow = null;
	});

	if (dev) loadVite(port);
	else serveURL(mainWindow);
}

app.once('ready', () => {
	createMainWindow();
	const projectDataPath = path.join(app.getPath('userData'), 'JetProjectData');

	if (!fs.existsSync(projectDataPath)) {
		fs.mkdirSync(projectDataPath, { recursive: true });
	}
});
app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('to-main', (event, count) => {
	return mainWindow.webContents.send('from-main', `next count is ${count + 1}`);
});


// window
ipcMain.on('window-close', () => {
	mainWindow.close();
});
ipcMain.on('window-minimize', () => {
	mainWindow.minimize();
});
ipcMain.on('window-maximize', () => {
	if (mainWindow.isMaximized()) {
		mainWindow.unmaximize();
	} else {
		mainWindow.maximize();
	}
});

// file
function listFilesRecursively(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const filesList = entries.map(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return { type: 'directory', name: entry.name, path: fullPath, children: listFilesRecursively(fullPath) };
        } else {
            return { type: 'file', name: entry.name, path: fullPath };
        }
    });
    return filesList;
}

ipcMain.handle('get-project', async (event) => {
    const projectDataPath = path.join(app.getPath('userData'), 'JetProjectData');
    const structure = listFilesRecursively(projectDataPath);
    return structure;
});

ipcMain.handle('get-project-data', async (event, filePath) => {
	const configPath = path.join(app.getPath('userData'), 'JetProjectData', filePath, 'config.json');
	const config = fs.readFileSync(configPath, 'utf-8');
	return config;
});

ipcMain.handle('get-file', async (event, filePath) => {
	const file = fs.readFileSync(filePath, 'utf-8');
	return file;
});

ipcMain.handle('save-file', async (event, filePath, content) => {
	fs.writeFileSync(filePath, content);
	return true;
});

ipcMain.handle('create-file', async (event, fileName) => {
	const filePath = path.join(app.getPath('userData'), 'JetProjectData', fileName);
	fs.writeFileSync(filePath, '');
	return true;
});

ipcMain.handle('create-folder', async (event, folderName) => {
	const folderPath = path.join(app.getPath('userData'), 'JetProjectData', folderName);
	fs.mkdirSync(folderPath, { recursive: true });
	return true;
});