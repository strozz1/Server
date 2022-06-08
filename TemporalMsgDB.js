const mongoose = require('mongoose')
const Message = require('./Message')
const uri =
    "mongodb://localhost:27017/test";

async function getMessages(user) {
    user.toLowerCase()
    var doc
    const client = mongoose.connect(uri)
        .then(() => console.log("Connected. Getting msg for user ",user))
        .catch(e => console.log(e));

    return await Message.find({ type: "message", "content.username": user }).then(
        (res, err) => {
            
            return res

        })
}

async function saveMessage(content) {
    const client = mongoose.connect(uri)
        .then(() => console.log("connected"))
        .catch(e => console.log(e));
    await Message.insertMany(content).then( (err) => { if (err) console.log(err); })
}
 function deleteUser(user) {
    const client = mongoose.connect(uri)
        .then(() => console.log("connected"))
        .catch(e => console.log(e));
     Message.deleteMany({"content.username":user}).then( (err) => { if (err) console.log(err); })
}


module.exports={saveMessage, getMessages,deleteUser};