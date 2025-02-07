import express from 'express'
import {db} from '../app.js'
import multer from 'multer';
import { nanoid } from 'nanoid';
import { validateAlbum } from '../validator.js';


const router = express.Router()

//Endpoint to get tracks name for specific album
router.get('/:albumId/tracks', (req, res) => {
    const albumId = req.params.albumId;

    try{
        const sql = 'SELECT * FROM tracks WHERE AlbumId = ?';
        const trackStatement = db.prepare(sql);
        const trackData = trackStatement.all(albumId);

        if(!trackData){
            res.status(404).send();
        }

        res.send(trackData);
    }
    catch(error){
        res.status(500).send({message: error.message});
    }
});

//Endpoint to add a new album
router.post('/', (req, res) => {
    try {
        // Validate input payload
        const validationError = validateAlbum(req.body);
        if (validationError) {
            return res.status(422).json(validationError);
        }

        const columns = []
        const values = []
        for (const property in req.body){
            columns.push(property)
            values.push(req.body[property])
        }


        // Insert the album into the database
        const albumStatement = db.prepare(
            `INSERT INTO albums (${columns.join(', ')}) 
            VALUES (${Array(columns.length).fill('?').join(', ')})`
        );
        const result = albumStatement.run(values);


            // Send a successful response with the last inserted ID
            res.status(201).json(result);
    }
    catch (error) {console.error('Error updating artists:', error)
        res.status(500).json({
            message: 'Interanal error'
        })}
});

router.get('/:albumId', (req, res) => {
    const albums = db.prepare('SELECT * FROM albums where AlbumId = ?');
    const data = albums.get(req.params.albumId);
    res.json(data);
});

//Endpoint to modify an album
router.patch('/:albumId', (req, res) => {
    try{
        
        const validationError = validateAlbum(req.body);
        if (validationError) {
            return res.status(422).json(validationError);
        }
        const columns = [];
        const values = [];
        for (const property in req.body) {
          columns.push(`${property} =?`);
          values.push(req.body[property])
        }
        values.push(req.params.albumId);
        const editAlbumSQL = `UPDATE albums SET ${columns.join(', ')} WHERE AlbumId =?`;
        const editAlbum = db.prepare(editAlbumSQL);
        const result = editAlbum.run(values);
        res.json(result);
    }
    catch(error) {
        console.error('Error updating artists:', error)
        res.status(500).json(
            {
            message: 'Interanal error'
            }
        )
    }

})

//Endpoint to delete an album
router.delete('/:albumId', (req, res) => {
    const deleteAlbum = db.prepare('DELETE from albums Where AlbumId = ?');
    const result = deleteAlbum.run([req.params.albumId]);
    console.log(result)
    if (result.changes > 0) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  });

//To store image file in albumart folder and in database
const storage = multer.diskStorage({
    destination: './_FrontendStarterFiles/albumart',
    filename: function (req, file, callback) {
        const albumArt = `${nanoid()}_${file.originalname}`;
        callback(null, albumArt);
    }
})
const upload = multer({ storage: storage })
router.post('/:albumId/albumart', upload.single('albumart'), (req, res) => {
    const query = db.prepare('UPDATE albums SET AlbumArt = ? WHERE AlbumId = ?');
    const result = query.run([req.file.filename, req.params.albumId]);
    res.json(result);
});

export default router