const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://change_bharuch:Developers_19@cluster0-lpmxb.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
const conn = mongoose.connection;
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
const db = mongoose.connection;


let gfs;
db.once("open", function () {
    gfs = Grid(db.db, mongoose.mongo);
});

// Setting up the storage element
const storage = GridFsStorage({
    url: (mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }),
    // gfs : gfs,
    filename: (req, file, cb) => {
        const date = Date.now();
        // The way you want to store your file in database
        cb(null, file.fieldname + '-' + date + '.');
    },

    // Additional Meta-data that you want to store
    metadata: function (req, file, cb) {
        cb(null, { originalname: file.originalname.extname(file.originalname) });
    },
    root: 'gallery' // Root collection name
});

const fileFilter = (req, file, next) => {
    if (!file) {
        return {
            message: "No file found."
        };
    }
    // Check if file to upload is supported ("jpg", "jpeg" or "png")
    const isImage = file.mimetype.startsWith('image/jpeg') || file.mimetype.startsWith('image/png') || file.mimetype.startsWith('image/png');
    // Reject upload if file is not supported
    if (!isImage) {
        return {
            message: "Image not in proper Format."
        };
    }
    // Accept file
    return next(null, true);
}

// Multer configuration for single file uploads
const upload = multer({
    storage: storage,
}).single('file');

router.get('/', (req, res) => {
    const filesData = [];
    const count = 0;
    gfs.collection('gallery'); // set the collection to look up into

    gfs.files.find({}).toArray((err, files) => {
        // Error checking
        if (!files || files.length === 0) {
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // Loop through all the files and fetch the necessary information
        files.forEach((file) => {
            filesData[count++] = {
                originalname: file.metadata.originalname,
                filename: file.filename,
                contentType: file.contentType
            }
        });
        res.json(filesData);
    });
});

// Route for file upload
router.post('/', (req, res, next) => {
    upload(req,res, (err) => {
        if(err){
             res.json({
                 message: err
             });
             return;
        }
        res.json({
            message: "Image uploaded successfully", 
            file_uploaded: true});
    });
});

// Downloading a single file
router.get('/:filename', (req, res) => {
    gfs.collection('gallery'); //set collection name to lookup into

    /** First check if file exists */
    gfs.files.find({ filename: req.params.filename }).toArray(function (err, files) {
        if (!files || files.length === 0) {
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // create read stream
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "gallery"
        });
        // set the proper content type 
        res.set('Content-Type', files[0].contentType)
        // Return response
        return readstream.pipe(res);
    });
});

module.exports = router;