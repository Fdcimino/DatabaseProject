//this thread opens the window then runs sql requests no aditions needed till line 72.
//WE only care about the stuff under like 72
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
// code.

//SQL base strings to make it easier to manage the requests
const SONG = "SELECT *, song.title as songTitle FROM song INNER JOIN appears_on ON song.s_id = appears_on.s_id INNER JOIN album on appears_on.a_id = album.a_id"
const ALBUM = 'SELECT * FROM album INNER JOIN released_by on album.a_id = released_by.a_id INNER JOIN artist on artist.name = released_by.name'

// all the functions below this are the sql queries called by a event sent from the render.js
//they run a query on the database and get the data back then send the response to the render.js

//gets all songs in the database
ipcMain.on('getAllSongs', (event, arg) =>{
  client.query(SONG + ';', (err, res) => { // runs a query async then runs functions in the curly brackets
    console.log(err ? err.stack : res.rows) // throws error if no response
    event.reply('allSongs', res.rows) //sends an event for the render thread to read
  })
})

//This gets all songs based on a search of the title
ipcMain.on('getSongs', (event, arg) =>{
  client.query(SONG + ' WHERE LOWER(title) LIKE LOWER(%\''+ arg + '\'%);', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allSongs', res.rows)
  })
})

//This gets all songs based on an album
ipcMain.on('getSongsAlb', (event, arg) =>{
  console.log(arg)
  client.query(SONG + ' WHERE album.title = \''+ arg + '\';', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    console.log(res)
    event.reply('allSongs', res.rows)
  })
})

//this gets all playlist made by a user
ipcMain.on('getAllPlaylistByUser', (event, arg) =>{
  client.query('SELECT * FROM playlist, listener WHERE username=' + arg +' AND creator_id = l_id;', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allSongs', res.rows)
  })
})

//this gets all users
ipcMain.on('getAllUsers', (event, arg) =>{
  client.query('SELECT * FROM listener', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allUsers', res.rows)
  })
})


//this gets all the artists
ipcMain.on('getAllArtists', (event, arg) =>{
  client.query('SELECT * FROM artist', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allArtists', res.rows)
  })
})

//this gets the albums from an artist 
ipcMain.on('getAlbums', (event, arg) =>{
  client.query(ALBUM + ' WHERE artist.name = \'' + arg + '\';', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    if(res){
      event.reply('allAlbums', res.rows)
    }
    
  })
})

//this gets all albums
ipcMain.on('getAllAlbums', (event, arg) =>{
  client.query(ALBUM + ';', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allAlbums', res.rows)
  })
})

lastPlaylistID = 0;

//this gets all the playlists in the database
ipcMain.on('getAllPlaylists', (event, arg) =>{
  client.query('SELECT * FROM playlist', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    res.rows.forEach((element) => {
      if(element.p_id > lastPlaylistID)
        lastPlaylistID = element.p_id
    })
    event.reply('allPlaylists', res.rows)
  })
})

//this updates the playlist
ipcMain.on('updatePlaylist', (event, arg) =>{
  console.log(arg)
  client.query('UPDATE playlist SET description = \'' + arg.description +'\', name = \'' + arg.name +'\', no_songs = ' + arg.num +', likes = ' + arg.likes +' WHERE p_id=' + arg.id +';', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    event.reply('allPlaylists', res.rows)
  })
})

ipcMain.on('signup', (event, arg) =>{
  console.log(arg)
})

ipcMain.on('createPlaylist', (event, arg) => {
  console.log(arg)
  lastPlaylistID += 1
  client.query('SELECT * FROM listener WHERE listener.username = \'' + arg.username +'\';', (err, res2) => {
    console.log(err ? err.stack : res2.rows)
    client.query('INSERT INTO playlist VALUES('+ (lastPlaylistID) + ',\'' + arg.description + '\',\'' + arg.name + '\',' + res2.rows[0].l_id + ',0, 0);', (err, res) => {
      console.log(err ? err.stack : res.rows)
      event.reply('newList')
    })
  })
    
})

ipcMain.on('addToPlaylist', (event, arg) => {
  client.query('INSERT INTO features VALUES('+ (arg.playlist) + ',' + arg.song + ');', (err, res) => {
    console.log(err ? err.stack : res.rows)
    
  })
})

ipcMain.on('viewPlaylist', (event , arg) => {
  console.log(arg)
  client.query('SELECT *, song.title as songtitle FROM playlist INNER JOIN features on playlist.p_id = features.p_id INNER JOIN song on song.s_id = features.s_id INNER JOIN appears_on ON song.s_id = appears_on.s_id INNER JOIN album on appears_on.a_id = album.a_id INNER JOIN listener on listener.l_id = playlist.creator_id WHERE playlist.name = \'' +arg +'\';', (err, res) => {
    console.log(res.rows)
    event.reply('viewSelectedList', res.rows)
  })
})

ipcMain.on('getUserPlaylists', (event, arg) => {
  console.log(arg)
  client.query('SELECT * FROM playlist  INNER JOIN listener on listener.l_id = playlist.creator_id WHERE listener.username = \'' + arg + '\';', (err, res) => {
    console.log(err ? err.stack : res.rows) // Hello World!
    obj = {
      user: arg,
      data: res.rows
    }
    event.reply('userPlaylists', obj)
  })
})

