var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://127.0.0.1:27017/nodeauth');
var UserSch = mongoose.Schema({
    username: {
        type: String,
        index: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    filename: {
        type: String
    },
    originalname: {
        type: String
    }
})
var userModel = module.exports = mongoose.model('UserSch', UserSch);
module.exports.createUser = function (newUser) {
    bcrypt.hash(newUser.password, 10, function (err, hash) {
        if (err) console.log('Unable to hash password.');
        newUser.password = hash;
        try {
            newUser.save(function (err) {
                if (err) throw err;
                console.log('Person has been saved!');
            })
        } catch (exc) {
            console.log('unable to save person: [exception] ', exc);
        }

    })
    //  SYNCHRONOUS METHOD CAN ALSO BE APPLIED FOR SAVING... UNCOMMENT THE CODE.
    // newUser.password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(10));
    // newUser.save(function(err){
    //     if(err) throw err;
    //     console.log('Person has been saved.');
    // })
}

module.exports.findByEmail = function (email, cb) {
    console.log('find by username is invoked', email);
    userModel.findOne({ email: email }, cb);
}

module.exports.comparePasswords = function(password, hash, cb){
    bcrypt.compare(password, hash, function(err, matched){
        if(err) return cb(err);
        cb(null, matched);
    })
}
module.exports.getUserById = function(id, cb){
    userModel.findById(id, cb);
}