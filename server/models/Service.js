const { Schema, model } = require('mongoose');
const User = require('./User');
const optionSchema = require('./Option');

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    options: [optionSchema],
    cleanup: {
        type: Number,
        required: true,
    },
    practitioner: [{ type: Schema.Types.ObjectId, ref: 'User'}]

});

const Service = model('Service', serviceSchema);

module.exports = Service;