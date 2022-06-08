const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSquema = new Schema({
    username: String,
    password: String,
    mail: String,
    image: String,
    created: {type: Date, default: Date.now}
},{
    versionKey:false
})


const Usuario = mongoose.model('usuario',userSquema)

module.exports= Usuario;