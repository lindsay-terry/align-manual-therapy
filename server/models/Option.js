const { Schema } = require('mongoose');

const optionSchema = new Schema({
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    }

});

module.exports = optionSchema;