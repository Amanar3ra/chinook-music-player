import Joi from "joi"

//Schema for post in artist
const artistPostSchema = Joi.object(
    {
        Name: Joi.string().max(120).required()
    }
)

//Schema for patch in artist
const artistPatchSchema = Joi.object(
    {
        Name: Joi.string().max(120)
    }
);



//Schema for post/patch in album
const albumPostSchema = Joi.object(
    {
        Title: Joi.string().max(20).required(),
        ReleaseYear: Joi.number().optional(),
        ArtistId: Joi.number().integer()
    }
);

//Schema for post/patch in track
const tracksSchema = Joi.object({
    Name: Joi.string().max(50).required(),
    MediaTypeId: Joi.number().integer().max(5).required(),
    AlbumId: Joi.number().integer(),
    Milliseconds: Joi.number().integer().min(1).required()
});

//Function for post in artist
export const validatePostArtist = payload => {
    const result = artistPostSchema.validate(payload);
    if(result.error){
        const errorMessages = result.error.details.map(detail => ({
            message: detail.message
        }))

        return errorMessages
    }
    return null
}

//Function for patch in artist
export const validatePatchArtist = payload => {
    const result = artistPatchSchema.validate(payload);
    if(result.error){
        const errorMessages = result.error.details.map(detail => ({
            message: detail.message
        }))
        return errorMessages
    }

    return null
}

//Function for post/patch in album
export const validateAlbum = payload => {
    const result = albumPostSchema.validate(payload);
    if(result.error){
        const errorMessages = result.error.details.map(detail => ({
            message: detail.message
        }))
        return errorMessages
    }

    return null
}

//Function for post/patch in album
export const validateTrack = payload => {
    const result = tracksSchema.validate(payload);
    if(result.error){
        const errorMessages = result.error.details.map(detail => ({
            message: detail.message
        }))
        return errorMessages
    }

    return null
}