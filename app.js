import express from 'express'
import dotenv from 'dotenv'

import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.js'
import cors from 'cors'; 
import mongoose,{Error} from 'mongoose';
//  import userRouter from './routes/user.js'

const app=express();
dotenv.config();
const connect = async () => {
    try {
  
      await mongoose.connect(process.env.mongo).then(()=>{console.log("conected to mongoDb")})
    //   console.log("Connected to MongoDB");
      
    //   await mongoose.connect(process.env.mongo)
    //    console.log("Connected to MongoDB");
    } catch (error) {
      throw error;  
    }
  };
  mongoose.connection.on("disconnected", () => {
    console.log("disconected!")
  });
  mongoose.connection.on("Conected", () => {
    console.log("Mongo db connected");
  });
//middle were 
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cors({
    origin:'http://localhost:3001'
}));
app.use(cookieParser());
app.use(express.json())


app.use('/auth', authRoute);
// app.use('/user', userRouter);
app.use((error, req, res, next) => {
  const errorStatus=error.status|| 500
  const errorMsg=error.message ||"Somthing is wrong"
  return res.status(errorStatus).json({
    success: false,
    status:errorStatus,
    message:errorMsg,
    stack:error.stack,
  })

 // return res.status(500).json("error find in page", Error)
})




const port=process.env.port||3000;

app.listen(port,()=>{
    connect()
    console.log(`Server is running on port ${port}`);
})
