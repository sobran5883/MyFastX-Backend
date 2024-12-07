import User from '../models/user.model.js';                             
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

import OtpModel from '../models/otp.model.js'                          
import {otpVerification} from '../helpers/otpValidate.js'


import otpGenerator from 'otp-generator';
import fetch from "node-fetch";

async function createUser(mobile) {
  try {
      const newUser = new User({ username: 'user'+ Math.floor(Math.random() * 9000), mobile });
      await newUser.save();
      return newUser;
  } catch (error) {
      throw new Error("Error creating new user");
  }
}

export const sendotp = async (req, res, next) => { 
  const { mobile } = req.body;
  try {
      let validUser = await User.findOne({ mobile }); 
      if (!validUser) {
          validUser = await createUser(mobile);
      }
      
      const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
      const cDate = new Date();
      
      await OtpModel.findOneAndUpdate(
          { mobile },
          { otp, otpExpiration: new Date(cDate.getTime()) },
          { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      const phone = mobile.replace("+","");
      const message = await fetch(`https://smsgw.tatatel.co.in:9095/campaignService/campaigns/qs?dr=false&sender=FRICOZ&recipient=${phone}&msg=Dear Customer, Your OTP for mobile number verification is ${otp}. Please do not share this OTP to anyone - Firstricoz Pvt. Ltd.&user=FIRSTR&pswd=First^01&PE_ID=1601832170235925649&Template_ID=1607100000000306120`);
      
      return res.status(200).json({
          success: true,
          msg: "OTP sent successfully!"
      });
  } catch(error) {
      next(error);   
  }
}

  export const verifyotp = async (req, res, next) => {
    try {
      const { mobile, otp } = req.body;
      const otpData = await OtpModel.findOne({ mobile, otp });
  
      if (!otpData) {
        return res.status(400).json({
          success: false,
          msg: 'You entered wrong OTP!'
        });
      }
  
      const isOtpExpired = await otpVerification(otpData.otpExpiration);
      if (isOtpExpired) {
        return res.status(400).json({
          success: false,
          msg: 'Your OTP has expired!'
        });
      }
      return res.status(200).json({
        success: true,
        msg: 'OTP verified successfully!',
      });
    } catch (error) {
      next(error);
    }
  };

  export const login = async (req, res, next)=>{
    const {mobile}=req.body;
    try{
      const validUser = await User.findOne({mobile});
      if(!validUser) return next(errorHandler(404, `user ${mobile} not found`));
      const token = jwt.sign({ id: validUser._id }, 'jfdaklfjaljf3598248959');
      res.cookie('access_token', token, { httpOnly: true}).status(200).json(validUser);
    }catch(error){
      next(error);
    }
  }
  export const signout = async (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
  };
