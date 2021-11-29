# DatabaseProject
 Music database

require node.js to run not complied version

## libs used
### node js
- electron-forge
- electron
- node-postgres

### css
- Materialize

## how to setup
- clone repo
- run npm init


## to run the program
- npm start 

## TODO:
- add to playlist
- create user
- remove from playlist
- search
- look at users playlist
- clicking on album or artist shows all songs in either

## quick run down of how this application work
Two threads
- render
- index

render thread is incharge on the ui. It send and listens to requests from the index thread using ipcRenderer

index thread gets the requests and responds using the ipcmain 

the index thread is the thread that sends for the sql requests while the render uses the responses to show it on html