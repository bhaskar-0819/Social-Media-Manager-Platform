const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    image: {
        type: Buffer, // Store the image as a buffer
        required: true
    },
    postTime: {
        type: Date,
        required: true
    },
    instagramUsername: {
        type: String, // Add field for Instagram username
        required: true
    },
    instagramPassword: {
        type: String, // Add field for Instagram password
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;