import express from 'express';
import {updateUser} from '../controler/UserData'

const router=express.Router();


router.put("/update",updateUser)









 

export default router;  