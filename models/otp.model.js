import mongoose from 'mongoose';
const otpSchema = new mongoose.Schema(
    {
        mobile:{
            type:String,
            required:true,
        },
        otp:{
            type:String,
            required:true
        },
        otpExpiration:{
            type:Date,
            default:Date.now,
            get:(otpExpiration)=>otpExpiration.getTime(),
            set:(otpExpiration)=>new Date(otpExpiration)
        }
    }
);

const OtpModel = mongoose.model('Otp', otpSchema);
export default OtpModel;