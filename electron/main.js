const { app, BrowserWindow, shell } = require('electron');

const LOAM_APP_URL = process.env.LOAM_APP_URL ?? 'https://loam-client.vercel.app/loado';
const LOAM_APP_ORIGIN = new URL(LOAM_APP_URL).origin;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'LoaM',
    backgroundColor: '#18181b',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL(LOAM_APP_URL);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (new URL(url).origin === LOAM_APP_ORIGIN) return;

    event.preventDefault();
    shell.openExternal(url);
  });
}

app.setName('LoaM');

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
