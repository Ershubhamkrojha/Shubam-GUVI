import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    age: {
        type: Number,
       
    },
    gender: {
        type: String,
       
    },
    dob: {
        type: String,
        
    },
    mob: {
        type: String,
       
    },
});

export default mongoose.model("User", UserSchema);
