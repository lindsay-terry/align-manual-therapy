const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const serviceSchema = require('./Service');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
              return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address.`
        },
        required: [true, 'Please include a valid email address'],
    },
    phone: {
        type: String,
        validate: {
          validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']
      },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: 24,
    },
    // Regular user = 0, Admin = 1
    role: {
        type: Number,
        default: 0,
    },
    birthdate: {
        type: Date,
        required: [true, 'Please enter date of birth'],
    },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
});

// Set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  
    next();
  });
  
  // Compare the incoming password with the hashed password
  userSchema.methods.isCorrectPassword = async function (password) {
    await bcrypt.compare(password, this.password);
  };

const User = model('User', userSchema);

module.exports = User;