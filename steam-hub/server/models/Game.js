const mongoose = require('mongoose');

const requirementSchema = {
    os: String,
    processor: String,
    memory: String,
    storage: String,
    graphics: String
};

const gameSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    steam_id: {
        type: String,
        unique: true,
        sparse: true,
        required: true
    },
    images: {
        logo: String,
        banner: String,
        main: String
    },
    developer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    systemRequirements: {
        minimum: requirementSchema,
        recommended: requirementSchema
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    tags: {
        type: [String],
        default: [],
        index: true
    },
    isEnabled: {
        type: Boolean,
        default: true,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
