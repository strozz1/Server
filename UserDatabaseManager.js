const mongoose = require('mongoose')
const Usuario = require('./User')
const uri =
    "mongodb://localhost:27017/test";

async function getUserCredentials(user,pass) {
    user.toLowerCase()
    var doc
    const client = mongoose.connect(uri)
        .then(() => console.log("Connected. Getting credentials for ",user))
        .catch(e => console.log(e));
console.log('Search for '+user+' and '+pass)
    return await Usuario.find({ 'username': user, 'password': pass }).then(
        (res, err) => {
            return res

        })
}

async function guardarUsuario(user,pass,mail,image) {
    const client = mongoose.connect(uri)
        .then(() => console.log("connected"))
        .catch(e => console.log(e));
        var content =`{"username": "${user}",
        "password": "${pass}",
        "mail": "${mail}",
        "image": "${image}"}`;
         var users= await checkUserExist(user,mail)
         console.log('users'+users)
         if(users.length<1){
            var obj = JSON.parse(content)
             await Usuario.insertMany(obj).then( (err) => { if (err) console.log(err); })
            return true;
         }
         return false;
}
async function checkUserExist(user,mail){
    const client = mongoose.connect(uri)
    .then(() => console.log("connected"))
    .catch(e => console.log(e));
   return  await Usuario.find({ "username": user }).then(
        (res, err) => {
            return res
        })
}

module.exports={getUserCredentials, guardarUsuario};