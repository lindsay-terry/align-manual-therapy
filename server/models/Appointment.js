const { Schema, model } = require('mongoose');
const User = require('./User');
const Service = require('./Service');

const appointmentSchema = new Schema({
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
}, { timestamps: true, });

const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;