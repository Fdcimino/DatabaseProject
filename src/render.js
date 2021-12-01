//we need the ipc renderer to communicate with the index thread
const { ipcRenderer } = require('electron');

//all is from a early editions basicly this is all the data shown in the lists even if searched through
//this is only the current data
allSongs = []
allUsers = []
allArtists = []
allAlbums = []
allPlaylists = []
currentUser = ""

//called after DOM Loads
function load() {
    getAllSongs()
    getAllUsers()
    getAllPlaylists()
};



//waits for the all songs event then calls the show songs function
ipcRenderer.on('allSongs', (event, arg) => {
    allSongs = arg;
    console.log(allSongs)
    showSongs()
})

//adds all the songs to the center list after clearing it. Vanlila js gets a little messy here for the html elements
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
        text.innerHTML = element.songtitle + " &emsp; plays: " + element.no_plays + '</br>' + element.title
        li.appendChild(text)
        if( currentUser != ""){

            li.appendChild(addButton)
        }
        
        li.appendChild(playButton)
        centerList.appendChild(li)
    })
}

//function called when songs button is pressed
function getAllSongs(){
    toSearch = document.getElementById("toSearch")
    search = document.getElementById("searchTerms")
    if(toSearch.checked){
        ipcRenderer.send('getSongs', search.value)
        console.log()
    }else{
        ipcRenderer.send('getAllSongs')
    } 
}



//waits for the all users event then calls the show users function
ipcRenderer.on('allUsers', (event, arg) => {
    allUsers = arg;
    console.log(allUsers)
    showUsers()
})

//shows all users that are in the allUsers array. 
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

//called when the program starts to list all of the users
function getAllUsers(){
    ipcRenderer.send('getAllUsers')
}


//waits for the all artists event then calls the show artist functions
ipcRenderer.on('allArtists', (event, arg) => {
    allArtists = arg;
    console.log(allArtists)
    showArtists()
})

//changes the centerlist to show all artists
function showArtists(){
    centerTitle = document.getElementById("centerTitle")
    centerList = document.getElementById("centerList")
    centerTitle.innerHTML ="Artists"
    centerList.innerHTML = ""
    allArtists.forEach(element =>{
        let li = document.createElement('li')
        li.className = "collection-item blue-grey darken-1 waves-effect waves-light"
        li.addEventListener("click", function() {
            getAllAlbumsFromArtist(element.name)
         }, false)
        let text = document.createElement('p')
        console.log(element)
        text.innerHTML = element.name
        li.appendChild(text)
        centerList.appendChild(li)
    })
}

//called when the artist buttons is pressed to list all of the artists
function getAllArtists(){
    toSearch = document.getElementById("toSearch")
    search = document.getElementById("searchTerms")
    if(toSearch.checked){
        ipcRenderer.send('getArtists', search.value)
        console.log()
    }else{
        ipcRenderer.send('getAllArtists')
    }  
    
}

//waits for allAlbums event from the index.js thread
ipcRenderer.on('allAlbums', (event, arg) => {
    allAlbums = arg;
    console.log(allAlbums)
    showAlbums()
})

//shows all albums in the allalbums list
function showAlbums(){
    centerTitle = document.getElementById("centerTitle")
    centerList = document.getElementById("centerList")
    centerTitle.innerHTML ="Albums"
    centerList.innerHTML = ""
    allAlbums.forEach(element =>{
        let li = document.createElement('li')
        li.className = "collection-item blue-grey darken-1 waves-effect waves-light"
        li.addEventListener("click", function() {
            getSongsAlb(element.title)
         }, false)
        let text = document.createElement('p')
        console.log(element)
        text.innerHTML = element.title +" &emsp; released by: " + element.name
        li.appendChild(text)
        centerList.appendChild(li)
    })
}

//call when artist is clicked on
function getAllAlbumsFromArtist(artist){
    ipcRenderer.send('getAlbums', artist)
}

//call when artist is clicked on
function getSongsAlb(album){
    ipcRenderer.send('getSongsAlb', album)
}

//call when album is clicked on
function getAllAlbums(){
    ipcRenderer.send('getAllAlbums')
}

//waits for all Playlists event to be called
ipcRenderer.on('allPlaylists', (event, arg) => {
    allPlaylists = arg;
    console.log(allPlaylists)
    showPlaylists()
})

//shows all the playlists on the left
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

//called when program starts to show all playlists
function getAllPlaylists(){
    toSearch = document.getElementById("toSearch")
    search = document.getElementById("searchTerms")
    if(toSearch.checked){
        ipcRenderer.send('getPlaylists', search.value)
        console.log()
    }else{
        ipcRenderer.send('getAllPlaylists')
    }  
}

//called when loginBTN pressed shows login screen in the center. 
function loginBTN(){
    centerTitle = document.getElementById("centerTitle")
    centerList = document.getElementById("centerList")
    centerTitle.innerHTML = "Login"
    centerList.innerHTML = ""

    let li = document.createElement('li')
    li.className = "collection-item  blue-grey darken-1"

    let username = document.createElement('input')
    username.placeholder = "Username"
    username.type = 'text';
    username.className = "white-text"

    let li2 = document.createElement('li')
    li2.className = "collection-item  blue-grey darken-1"
    let button = document.createElement('button')
    button.className = 'btn right'
    button.innerHTML = 'Login'
    button.addEventListener("click", function() {
        currentUser = username.value
        console.log(currentUser)
     }, false)

    li.appendChild(username)
    li2.appendChild(button)
    centerList.appendChild(li)
    centerList.appendChild(li2)
}

//Shows signup screen in the center list when pressed
function SignUpBTN(){
    centerTitle = document.getElementById("centerTitle")
    centerList = document.getElementById("centerList")
    centerTitle.innerHTML = "Signup"
    centerList.innerHTML = ""

    let li = document.createElement('li')
    li.className = "collection-item  blue-grey darken-1"
    let username = document.createElement('input')
    username.placeholder = "Username"
    username.type = 'text';
    username.className = "white-text"

    let li3 = document.createElement('li')
    li3.className = "collection-item  blue-grey darken-1"
    let email = document.createElement('input')
    email.placeholder = "Email"
    email.type = 'text';
    email.className = "white-text"


    let li2 = document.createElement('li')
    li2.className = "collection-item  blue-grey darken-1"
    let button = document.createElement('button')
    button.className = 'btn right'
    button.innerHTML = 'Signup'
    button.addEventListener("click", function() {
        info = {
            user: username.value,
            email: email.value
        }
        ipcRenderer.send("signup", info)
     }, false)

    li.appendChild(username)
    li3.appendChild(email)
    li2.appendChild(button)
    centerList.appendChild(li)
    centerList.appendChild(li3)
    centerList.appendChild(li2)
}