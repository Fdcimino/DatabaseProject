const { app, BrowserWindow, ipcMain } = require('electron');
const {Client} = require('pg');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const client = new Client({
  host: 'home.whitejediguy.com',
  port: 5432,
  user: 'cse412',
  password: 'cse412Project!',
  database: 'music_db'
})

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

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

ipcMain.on('getAllSongs', (event, arg) =>{
  client.query('SELECT * FROM song INNER JOIN appears_on ON song.s_id = appears_on.s_id INNER JOIN album on appears_on.a_id = album.a_id;', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allSongs', res.rows)
  })
})

//This is the search version
ipcMain.on('getSongs', (event, arg) =>{
  client.query('SELECT * FROM song WHERE LOWER(title) LIKE LOWER(%\''+ arg + '\'%);', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allSongs', res.rows)
  })
})

ipcMain.on('getAllPlaylistByUser', (event, arg) =>{
  client.query('SELECT * FROM playlist, listener WHERE username=' + arg +' AND creator_id = l_id;', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allSongs', res.rows)
  })
})

ipcMain.on('getAllUsers', (event, arg) =>{
  client.query('SELECT * FROM listener', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allUsers', res.rows)
  })
})


//This is the search version
ipcMain.on('getUsers', (event, arg) =>{
  client.query('SELECT * FROM listener', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allUsers', res.rows)
  })
})

ipcMain.on('getAllArtists', (event, arg) =>{
  client.query('SELECT * FROM artist', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allArtists', res.rows)
  })
})

ipcMain.on('getAlbums', (event, arg) =>{
  client.query('SELECT * FROM album INNER JOIN released_by on album.a_id = released_by.a_id INNER JOIN artist on artist.name = released_by.name WHERE artist.name = \'' + arg + '\';', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    if(res){
      event.reply('allAlbums', res.rows)
    }
    
  })
})

ipcMain.on('getAllAlbums', (event, arg) =>{
  client.query('SELECT * FROM album INNER JOIN released_by on album.a_id = released_by.a_id INNER JOIN artist on artist.name = released_by.name', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allAlbums', res.rows)
  })
})

ipcMain.on('getAllPlaylists', (event, arg) =>{
  client.query('SELECT * FROM playlist', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allPlaylists', res.rows)
  })
})

ipcMain.on('updatePlaylist', (event, arg) =>{
  console.log(arg)
  client.query('UPDATE playlist SET description = \'' + arg.description +'\', name = \'' + arg.name +'\', no_songs = ' + arg.num +', likes = ' + arg.likes +' WHERE p_id=' + arg.id +';', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allPlaylists', res.rows)
  })
})