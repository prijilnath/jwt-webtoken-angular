var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var schema = new Schema({
    email: {type:String, required:true},
    name: {type:String, required:true},
    password: {type:String, required:true},
    date: {type:Date, required:true}
});

schema.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password,10);
};

schema.methods.isValid = function isValid(hashedpassword) {
    return bcrypt.compareSync(hashedpassword, this.password)
};

module.exports = mongoose.model('User',schema);