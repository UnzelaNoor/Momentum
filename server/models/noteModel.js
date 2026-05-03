const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        text: {
            type: String,
            default: ''
        },
        category: {
            type: String,
            enum: ['work', 'home', 'study', 'health', ''],
            default: ''
        },
        lastEdited: {
            type: String,
            default: () => new Date().toLocaleDateString('en-GB')
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);