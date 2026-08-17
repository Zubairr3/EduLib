const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Connect to your Cloudinary account
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Automatically check if the uploaded file is a document
        const isDocument = file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i);
        
        return {
            folder: 'edulib_uploads',
            // Use 'raw' for documents so Cloudinary does not corrupt them into images
            resource_type: isDocument ? 'raw' : 'auto'
        };
    }
});

const upload = multer({ storage: storage });
module.exports = upload;