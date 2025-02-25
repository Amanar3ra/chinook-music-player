const { validatePostArtist, validatePatchArtist, validateAlbum, validateTrack } = require("./validator.js");

describe("Validation Tests", () => {
    
    test("validatePostArtist should return null for a valid artist", () => {
        const artist = { Name: "The Beatles" };
        expect(validatePostArtist(artist)).toBeNull();
    });

    test("validatePostArtist should return an error for a missing Name", () => {
        const artist = {};
        expect(validatePostArtist(artist)).not.toBeNull();
    });

    test("validatePatchArtist should return null for an empty payload (optional Name)", () => {
        const artist = {};
        expect(validatePatchArtist(artist)).toBeNull();
    });

    test("validateAlbum should return an error if Title is missing", () => {
        const album = { ReleaseYear: 2000, ArtistId: 1 };
        expect(validateAlbum(album)).not.toBeNull();
    });

    test("validateTrack should return an error if Milliseconds is less than 1", () => {
        const track = { Name: "Song", MediaTypeId: 2, AlbumId: 1, Milliseconds: 0 };
        expect(validateTrack(track)).not.toBeNull();
    });

});
