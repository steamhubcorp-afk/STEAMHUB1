const mongoose = require('mongoose');

const librarySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    games: [{
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game',
            required: true
        },
        expirationDate: {
            type: Date,
            required: true,
            index: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);
