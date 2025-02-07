import express from 'express'
import {db} from '../app.js'

const router = express.Router()

//Endpoint to get all the media types
router.get('/', (req, res) => {
    const medias = db.prepare(`SELECT * FROM media_types`)
    const result = medias.all()
    res.json(result)
})

export default router