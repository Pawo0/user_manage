const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.pre('save', async function (next){
    if (this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
})

UserSchema.methods.comparePassword = async function comparePassword(password){
    return await bcrypt.compare(password,this.password)

}

UserSchema.methods.createJWT = function (){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}





module.exports = mongoose.model('User', UserSchema)