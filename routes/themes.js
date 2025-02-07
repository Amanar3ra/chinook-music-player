import express from 'express'
import {db} from '../app.js'

const router = express.Router()

//Endpoint to get all the themes
router.get('/', (req, res) => {
    const themes = db.prepare(`SELECT * FROM themes`)
    const result = themes.all()
    res.json(result)
})

export default router