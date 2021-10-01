import  mongoose  from "mongoose";

const instance = mongoose.Schema({
    username: String,
    message: String,
    timestamp: String
})

export default mongoose.model('messages',instance)