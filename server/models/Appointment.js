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
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true, });

const Appointment = model('Appointment', appointmentSchema);

module.exports = Appointment;