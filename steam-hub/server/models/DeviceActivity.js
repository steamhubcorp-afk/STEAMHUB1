const mongoose = require('mongoose');

const deviceActivitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    deviceName: {
        type: String
    },
    ipAddress: {
        type: String
    },
    appToken: {
        type: String,
        unique: true,
        sparse: true
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    logoutTime: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DeviceActivity', deviceActivitySchema);
