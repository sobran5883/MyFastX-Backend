import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            unique:true,
        },
        mobile:{
            type:String,
            required:true,
            unique:true,
        },
        avatar:{
            type: String,
            default: "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
        },
    },
    {timestamps:true}
);

const User = mongoose.model('User', userSchema);
export default User;