const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSquema = new Schema({
    type: String,
    content: {
        username: String,
        sender: String,
        content: String
    },
    time: {type: Date, default: Date.now}
},{
    versionKey:false
})


const Mensaje = mongoose.model('waiting_list',messageSquema)

module.exports= Mensaje;