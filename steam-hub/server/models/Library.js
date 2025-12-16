const mongoose = require('mongoose');

const librarySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);
