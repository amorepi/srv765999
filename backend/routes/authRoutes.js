import express from "express";
import { authContr } from "../controllers/authContr.js";

const router = express.Router();

router.get('/login', authContr.showLogin);
router.post('/login', authContr.processLogin);
router.get('/logout', authContr.logout);

export default router;
