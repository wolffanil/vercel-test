const db = require('../database');

const Schema = new db.Schema({
    name: {
        type: String,
        
    },
    resp:{
        type:String
    },
    diz:{
        type:String
    },
    description:{
        type:String
    },
    date:{
        type:String
    }
});
module.exports = db.model('Comments',Schema);