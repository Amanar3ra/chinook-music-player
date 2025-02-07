import express from 'express'
import Database from 'better-sqlite3'
import artistsRouter from './routes/artist.js'
import albumRouter from './routes/album.js'
import trackRouter from './routes/tracks.js'
import mediaRouter from './routes/media.js'
import themesRouter from './routes/themes.js'


const app = express();

//Establish a connection to our database
export const db = new Database('./database/chinook.sqlite', {fileMustExist: true})


//Middleware
app.use(express.json())
app.use(express.static("_FrontendStarterFiles"))
app.use('/api/artists', artistsRouter)
app.use('/api/albums', albumRouter)
app.use('/api/tracks', trackRouter)
app.use('/api/mediaTypes', mediaRouter)
app.use('/api/themes', themesRouter)


//Listening on port 3000
app.listen(3000, () => {
    console.log('Listening on port 3000')
})