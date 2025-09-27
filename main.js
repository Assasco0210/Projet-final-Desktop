const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

app.disableHardwareAcceleration();

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Gestion redirection
ipcMain.on("redirect", (event, page) => {
  if (mainWindow) {
    mainWindow.loadFile(page);
  }
});
