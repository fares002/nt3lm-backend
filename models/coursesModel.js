const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false,
        enum: ['علمي', 'أدبي', '', "", ``]
    },
    duration: {
        type: String, // Assuming duration is in hours
        required: false
    },
    author: {
        type: String, // You can change this to an ObjectId to reference a User model if needed
        required: true
    },
    thumbnail:{
        type: String,
        default:'/uploads/nt3lm.jpg'

    },
    videos: [
        {
            title: {
                type: String,
            },
            description: {
                type: String,
                required: false
            },
            url: {
                type: [String],
                required: true // Assuming you have a URL for each video
            }
        }
    ]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = {
    Course
};
