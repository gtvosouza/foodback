const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: false,
    },    
    state: {
        type: String,
        require: false,
    },
    role: {
        type: String,
        require: false,
    },    
    avatar: {
        type: String,
        require: false,
    },
    bio: {
        type: String,
        require: false,
    },
    country: {
        type: String,
        require: false,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;