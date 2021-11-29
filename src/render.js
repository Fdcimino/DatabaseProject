
const { ipcRenderer } = require('electron');

allSongs = []
allUsers = []
allArtists = []
allAlbums = []
allPlaylists = []
currentUser = ""



function setUsername(){
    username = document.getElementById("Username").value
    currentUser = username;
    console.log(currentUser)
    document.getElementById("loginBTN").innerHTML = "ReLogin"
    showSongs()
}


//The next functions gets all songs
ipcRenderer.on('allSongs', (event, arg) => {
    allSongs = arg;
    console.log(allSongs)
    showSongs()
})

function showSongs(){
    centerTitle = document.getElementById("centerTitle")
    centerList = document.getElementById("centerList")
    centerTitle.innerHTML = "Songs"
    centerList.innerHTML = ""
    allSongs.forEach(element =>{
        let li = document.createElement('li')
        li.className = "collection-item  blue-grey darken-1"
        let text = document.createElement('p')

        var addButton = ""
        if(currentUser != ""){
            let inputDiv = document.createElement('div')
            let select = document.createElement('select')


            addButton = document.createElement('a')
            addButton.className = "btn btn-large waves-effect waves-light green right fixP"
            let addIcon = document.createElement('i')
            addIcon.innerHTML = "add"
            addIcon.className = "material-icons"
            addButton.appendChild(addIcon)
        }
       

        let playButton = document.createElement('a')
        playButton.className = "btn btn-large waves-effect waves-light green right fixP"
        let playIcon = document.createElement('i')
        playIcon.innerHTML = "fast_forward"
        playIcon.className = "material-icons"
        playButton.appendChild(playIcon)
        
        console.log(element)
        text.innerHTML = element.title + '</br>' + element.genre
        li.appendChild(text)
        if( currentUser != ""){

            li.appendChild(addButton)
        }
        
        li.appendChild(playButton)
        centerList.appendChild(li)
    })
}

function getAllSongs(){
    ipcRenderer.send('getAllSongs')
}

getAllSongs()

//The next functions gets all users
ipcRenderer.on('allUsers', (event, arg) => {
    allUsers = arg;
    console.log(allUsers)
    showUsers()
})

function showUsers(){
    centerTitle = document.getElementById("rightTitle")
    centerList = document.getElementById("rightList")
    centerList.innerHTML = ""
    allUsers.forEach(element =>{
        let li = document.createElement('li')
        li.className = "collection-item blue-grey darken-1 waves-effect waves-light"
        let text = document.createElement('p')
        console.log(element)
        text.innerHTML = element.username
        li.appendChild(text)
        centerList.appendChild(li)
    })
}

function getAllUsers(){
    ipcRenderer.send('getAllUsers')
}

getAllUsers()

//The next functions gets all artists
ipcRenderer.on('allArtists', (event, arg) => {
    allArtists = arg;
    console.log(allArtists)
    showArtists()
})

function showArtists(){
    centerTitle = document.getElementById("centerTitle")
    centerList = document.getElementById("centerList")
    centerTitle.innerHTML ="Artists"
    centerList.innerHTML = ""
    allArtists.forEach(element =>{
        let li = document.createElement('li')
        li.className = "collection-item blue-grey darken-1 waves-effect waves-light"
        let text = document.createElement('p')
        console.log(element)
        text.innerHTML = element.name
        li.appendChild(text)
        centerList.appendChild(li)
    })
}

function getAllArtists(){
    ipcRenderer.send('getAllArtists')
}

//The next functions gets all artists
ipcRenderer.on('allAlbums', (event, arg) => {
    allAlbums = arg;
    console.log(allAlbums)
    showAlbums()
})

function showAlbums(){
    centerTitle = document.getElementById("centerTitle")
    centerList = document.getElementById("centerList")
    centerTitle.innerHTML ="Albums"
    centerList.innerHTML = ""
    allAlbums.forEach(element =>{
        let li = document.createElement('li')
        li.className = "collection-item blue-grey darken-1 waves-effect waves-light"
        let text = document.createElement('p')
        console.log(element)
        text.innerHTML = element.title
        li.appendChild(text)
        centerList.appendChild(li)
    })
}

function getAllAlbums(){
    ipcRenderer.send('getAllAlbums')
}

//The next functions gets all artists
ipcRenderer.on('allPlaylists', (event, arg) => {
    allPlaylists = arg;
    console.log(allPlaylists)
    showPlaylists()
})

function showPlaylists(){
    centerTitle = document.getElementById("leftTitle")
    centerList = document.getElementById("leftList")
    centerTitle.innerHTML ="All playlists"
    centerList.innerHTML = ""
    allPlaylists.forEach(element =>{
        let li = document.createElement('li')
        li.className = "collection-item blue-grey darken-1 waves-effect waves-light"
        let text = document.createElement('p')
        console.log(element)
        text.innerHTML = element.title
        li.appendChild(text)
        centerList.appendChild(li)
    })
}

function getAllPlaylists(){
    ipcRenderer.send('getAllPlaylists')
}

getAllPlaylists()
