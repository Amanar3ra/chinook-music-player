import express from 'express'
import {db} from '../app.js'
import { validateTrack } from '../validator.js'

const router = express.Router()

//Endpoint to get specific track
router.get('/:trackId', (req, res) => {
    const trackStatement = db.prepare(`SELECT * FROM tracks WHERE TrackId = ?`)
    const result = trackStatement.get(req.params.trackId)
    res.json(result)
})

//Endpoint to add a new track
router.post('/', (req,res) => {
    try {
        // Validate input payload
        const validationError = validateTrack(req.body);
        if (validationError) {
            return res.status(422).json(validationError);
        }
        const columns = []
        const values = []
        for (const property in req.body){
            columns.push(property)
            values.push(req.body[property])
        }

        const addTrack = db.prepare(`INSERT INTO tracks (${columns.join(', ')}) VALUES (${Array(columns.length).fill('?').join(', ')})`)
        const result = addTrack.run(values)
        if(result.changes > 0){
            res.json(result)
        }else {
            res.status(404).json(result)
        }
    } catch(error) {
        console.error('Error updating artists:', error)
        res.status(500).json(
            {
            message: 'Interanal error'
            }
        )
    }
})

//Endpoint to update a track
router.patch('/:trackId', (req, res) => {
    try {
        // Validate input payload
        const validationError = validateTrack(req.body);
        if (validationError) {
            return res.status(422).json(validationError);
        }
        const columns = []
        const values = []
        for (const property in req.body){
            columns.push(`${property} = ?`)
            values.push(req.body[property])
        }

        values.push(req.params.trackId)
        const modifyTrack = db.prepare(`UPDATE tracks SET ${columns.join(', ')} WHERE TrackId = ?`)
        const result = modifyTrack.run(values)
        if(result.changes > 0){
            res.json(result)
        }else {
            res.status(404).json(result)
        }
    }catch(error) {
        console.error('Error updating artists:', error)
        res.status(500).json(
            {
            message: 'Interanal error'
            }
        )
    }
})

//Endpoint to delete a track
router.delete('/:trackId', (req, res) => {
    const deleteTrack = db.prepare(`DELETE FROM tracks WHERE TrackId = ?`)
    const result = deleteTrack.run(req.params.trackId)
    
    if(result.changes > 0){
        res.json(result)
    } else{
        res.status(404).json(result)
    }
})


export default router