import express from 'express';
import {sendotp, signout,login } from '../controllers/auth.controller.js';
import {verifyotp} from '../controllers/auth.controller.js'

const router = express.Router();

router.post("/sendotp", sendotp);
router.get("/signout", signout);
router.post("/verifyotp", verifyotp)
router.post("/login", login)

export default router;