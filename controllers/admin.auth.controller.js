import Admin from '../models/admin.model.js';
import bcryptjs from 'bcryptjs';                               
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup =async (req, res, next)=>{
    const {name, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);   
    const newAdmin = new Admin({name, email, password: hashedPassword});
    try{                                                      
      await newAdmin.save()                                     
      res.status(201).json("Admin created successfully")        
    }catch(error){                                             
      next(error);
    }
}

export const login = async (req, res, next)=>{                
  const {email, password}= req.body;
  try{
    const validAdmin = await Admin.findOne({email});             
    if(!validAdmin) return next(errorHandler(404, 'Admin not found!'));  
    const validPassword = bcryptjs.compareSync(password, validAdmin.password);  
    if(!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validAdmin._id },'jfdaklfjaljf3598248959');  
    const {password: pass, ...rest} = validAdmin._doc;          
    res.cookie('access_token', token, {httpOnly: true }).status(200).json(rest);   
  }catch(error){
    next(error);         
  }
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('admin has been logged out!');
  } catch (error) {
    next(error);
  }
};