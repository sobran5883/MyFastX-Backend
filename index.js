import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import adminAuthRouter from './routes/admin.route.js'
// import path from 'path';

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(()=>{console.log('MongoDb is connected!!')})
    .catch((err)=>{console.log(err)})

// const __dirname = path.resolve();    
const app= express();


app.use(express.json());
app.use(cors());

app.listen(3000,()=>{
    console.log('server is running on port 3000!!');
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminAuthRouter);

// app.use(express.static(path.join(__dirname, '/client/dist')));
// app.get('*',(req,res)=>{
//     res.sendFile(path.join(__dirname,'client','dist','index.html'));
// })

//MiddleWare for error handling and we using it in auth.controller.js as next(error)
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});