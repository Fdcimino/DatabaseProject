# DatabaseProject
 Music database

require node.js 17.1 to run not complied version

## libs used
### node js
- electron-forge
- electron
- node-postgres

### css
- Materialize

## how to setup
- clone repo
- run npm install

## to run the program
- npm start 

## TODO:
- create user
- add to playlist
- remove from playlist
- look at users playlist
- clicking on album or artist shows all songs in either
- fix some of the queries

## quick run down of how this application work
index.js is where the program starts. This is where the browser window gets created and opens index.html
render.js is ran on index.html

all we need to edit on index.js is below line 72. I may change some minor stuff above that line when we are finished so the menu bar doesnt show but thats all boilerplate. 

USE crl + Shift + i to open up dev tools.
console.logs from the render.js will showup there

console.logs form the index.js will showup in the console you ran npm start