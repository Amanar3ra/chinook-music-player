import express from 'express'
import {db} from '../app.js'
import { validatePostArtist, validatePatchArtist } from '../validator.js'


const router = express.Router()


//Endpoint to get all the artists
router.get('/', (req,res) => {
    try{
        const sql = 'SELECT * FROM artists';
        const artistStatement = db.prepare(sql);
        const artistData = artistStatement.all();

        if(!artistData){
            res.status(404).send();
        }

        res.send(artistData);
    }catch (error) {
        res.status(500).send({message: error.message});
    }
});


//Endpoint for search 
router.get('/search/:searchTerm', (req, res) => {
    try {
 
        const searchTerm = req.params.searchTerm;
        const searchStatement = db.prepare(`SELECT * FROM artists WHERE name LIKE ?`);
        const result = searchStatement.all(`%${searchTerm}%`);
 
        if (!result) {
            return res.status(201).send('No artists found');
        }
 
        res.json(result);
 
    } catch (error) {
        res.status(500).send({ message: 'Try Again Later' })
    }
 
});

//Endpoint to get albums for an artist
router.get('/:artistId/albums', (req,res) => {
    const artistId = req.params.artistId;
    try{
        const sql = 'SELECT * FROM albums WHERE ArtistId = ?';
        const albumStatement = db.prepare(sql);
        const albumData = albumStatement.all(artistId);

        if(!albumData){
            res.status(404).send();
        }

        res.send(albumData);
    } catch (error){
        res.status(500).send({message: error.message});
    }
});


//Endpoint to add a new artist
router.post('/', (req, res) => {
    try{
        const validationError = validatePostArtist(req.body)
        if(validationError){
            return res.status(422).json(validationError)
        }

        const row = db.prepare('SELECT MAX(ArtistId) AS maxId FROM artists').get()
        const newArtistId = row.maxId + 1;

        const artistName = req.body.Name;
        const artistStatement = db.prepare(`INSERT INTO artists (ArtistId, Name) VALUES (?, ?)`);
        const artistValues = [newArtistId, artistName]
        artistStatement.run(artistValues)
        res.status(201).send({ lastInsertRowid: newArtistId })
    } catch(err) {
        console.error("Error inserting artist:", err.message);
        res.status(500).send({message: err.message})
    }
})

//Endpoint to get artist information for update endpoint
router.get('/:artistid', (req, res) => {
    try {
        const artistId = req.params.artistid;
        const artistStatement = db.prepare("SELECT * FROM artists WHERE ArtistId = ?").get(artistId);
        
        if (!artistStatement) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.status(200).json(artistStatement);
    } catch (error) {
        console.error("Error fetching artist:", error);
        res.status(500).json({ message: "Failed to get artist information" });
    }
});

//Endpoint to update an artist
router.patch('/:artistId', (req, res) => {
    try{
        const validationError = validatePatchArtist(req.body)
        if(validationError){
            return res.status(422).json(validationError)
        }

        const updatedArtistName = req.body.Name
        const artistId = req.params.artistId

        const artistExists = db.prepare("SELECT * FROM artists WHERE ArtistId = ?").get(artistId);
        if (!artistExists) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const updateArtist = db.prepare(`UPDATE artists SET Name = ? WHERE ArtistId = ?`)
        const values = [updatedArtistName, artistId]
        const result = updateArtist.run(values)

        if (result.changes === 0) {
            return res.status(400).json({ message: 'No changes made to the artist' });
        }
        res.status(200).json({ message: 'Artist successfully updated' });
    } catch(error){
        console.error('Error updating artists:', error)
        res.status(500).json({
            message: 'Interanal error'
        })
    }
})

//Endpoint to delete an artist
router.delete('/:artistId', (req, res) => {
    const artistDelete = db.prepare(`DELETE FROM artists WHERE ArtistId = ?`)
    const {changes} = artistDelete.run([req.params.artistId])

    if (!changes === 0){
        res.status(404).send()
    }else{
        res.status(204).send()
    }
})

export default router