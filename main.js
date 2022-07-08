/*
TODO: server drops to 0 players inbetween maps - a second server with just 1 person playing might temporarily pop up and the client would auto-join it -> auto-join should lock server on
*/

const { app, BrowserWindow, session, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    // width: 986,
    height: 750,
    // height: 718,
    // autoHideMenuBar: true,
    icon: path.join(__dirname, '/cool_icon_small.ico'),
    // frame: false,  // just to try it out
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.setResizable(false);
  win.setMaximizable(false);
  win.setFullScreenable(false);
  win.removeMenu();  // comment this out to activate developer console 

  win.loadFile('index.html');

  win.webContents.setUserAgent("CoolLauncher v0.1");
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// *****************

const child = require('child_process').execFile;
var executablePath = "C:\\Program Files (x86)\\Renegade X\\Binaries\\Win64\\UDK.exe";
// var parameters = ["78.46.45.175", "-nomovies"];

ipcMain.on('join', (event, address) => {
    // console.log(address + ' from renderer')
    child(executablePath, [address, "-nomovies"], function(err, data) {
        console.log(err)
        console.log(data.toString());
   });
})
