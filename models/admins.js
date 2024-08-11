const db = require('../database');

const Schema = new db.Schema({
    login: {
        type: String,
        
    },
    password:{
        type:String
    }
});
module.exports = db.model('Admin',Schema);