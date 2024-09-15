const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

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
                return /\^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address.`
        },
        required: [true, 'Please include a valid email address'],
    },
    password: {
        type: String,
        required: true,
        min: [8, 'Password must be at least 8 characters'],
        max: 24,
    },
    // Regular user = 0, Admin = 1
    role: {
        type: Number,
        default: 0,
    },
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