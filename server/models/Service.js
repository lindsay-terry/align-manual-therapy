const { Schema, model } = require('mongoose');
const User = require('./User');
const optionSchema = require('./Option');

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // duration: {
    //     type: Number,
    //     required: true,
    // },
    options: [optionSchema],
    cleanup: {
        type: Number,
        required: true,
    },
    // price: {
    //     type: Number,
    //     required: true,
    //     min: 0,
    // },
    practitioner: [{ type: Schema.Types.ObjectId, ref: 'User'}]

});

const Service = model('Service', serviceSchema);

module.exports = Service;