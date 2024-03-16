const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

if (require('electron-squirrel-startup')) {
  app.quit();
}
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 890,
    height: 560,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    icon: __dirname + 'icons/favicon.ico',
  });

  mainWindow.loadFile(path.join(__dirname, 'pages/preloader.html'));
  mainWindow.setMenuBarVisibility(false);
  setTimeout(() => {
    const filePath = path.join(__dirname, 'data', 'data.json');
    fs.access(filePath, fs.constants.F_OK, () => {
        if (fs.existsSync(filePath)) {
            mainWindow.loadFile(path.join(__dirname, 'pages/app.html'));
        } else {
            mainWindow.loadFile(path.join(__dirname, 'pages/intro.html'));
        }
    });
}, 6000);

  ipcMain.handle('encryptAndSaveData', (event, username, address) => {
    console.log(username, address);
    if (username == 'choose a unique username' || address == 'your veruscoin address' || username == "" || address == "" || username.length < 5 || username.length > 15 || address.length != 34 || address.startsWith('R') == false) {
        dialog.showErrorBox('Error', 'Please enter a valid username (5 or more characters, less than 15 characters) and VerusCoin address (34 characters starting with "R"). Make sure that you are not submitting it empty.'); 
        return;
    }
    else {
    const usrnme = crypto.createHash('sha256').update(username).digest('hex');
    const usraddr = crypto.createHash('sha256').update(address).digest('hex');
    const encryptedData = { usrnme, usraddr };
    const jsonData = JSON.stringify(encryptedData);
    const filePath = path.join(__dirname, 'data', 'data.json');
    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            mainWindow.loadFile(path.join(__dirname, 'pages/intro.html'));
        } else {
            console.log('Data encrypted and saved successfully');
            mainWindow.loadFile(path.join(__dirname, 'pages/preloader.html'));
            setTimeout(() => {
                mainWindow.loadFile(path.join(__dirname, 'pages/app.html'));
          }, 6000);
        }
    });
  }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
