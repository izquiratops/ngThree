const {app, BrowserWindow, Menu} = require("electron");
const path = require("path");
const url = require("url");

let win;

Menu.setApplicationMenu(null)

function createWindow() {
  win = new BrowserWindow({width: 1280, height: 720});
  // win.maximize();

  // Loads the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname + '/dist/index.html'),
      protocol: "file:",
      slashes: true
    })
  );

  // win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });
}

// macOS won't quit the app if you don't do this
app.on("window-all-closed", () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// init!
app.on("ready", createWindow);
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
