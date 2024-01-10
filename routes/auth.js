import express from 'express';
 import { login, register ,updateUser,getUserById} from '../controler/auth.js';
const router = express.Router();
router.post("/register", register)
router.post("/login",login)
router.put("/:id",updateUser)
router.get('/:id', getUserById );

export default router;