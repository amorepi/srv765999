import express from "express";
import { usersContr } from "../controllers/usersContr.js";

const router = express.Router();

router.get('/allUsers'      , usersContr.allUsers);
router.get('/addUser'       , usersContr.showAddForm);
router.post('/addUser'      , usersContr.addUser);
router.get('/getUser/:id'   , usersContr.getUser);
router.get('/editUser/:id'  , usersContr.showEditForm); 
router.post('/editUser/:id' , usersContr.editUser); 
router.delete('/delUser/:id', usersContr.delUser);

export default router;
