const mongoose= require('mongoose')


const data=new mongoose.Schema({
    request_id:{type: String, default: ''},
    author:{type: String, default: ''},
    action:{type: String, default: ''},
    from_branch:{type: String, default: ''},
    to_branch:{type: String, default: ''},
    timestamp:{type: String, default: ''}
})

const Data=mongoose.model("Data", data)
module.exports=Data;