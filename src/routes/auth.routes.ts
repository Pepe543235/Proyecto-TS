import { Router } from "express";
import { getTimeToken, login, updateToken, authenticateToken, getAllUsers, saveUsers, updateUser, deleteUser } from "../controllers/auth.controllers";

const router = Router();

router.post('/login', login);
router.get('/getTime', authenticateToken, getTimeToken);
router.patch('/update/:userId', updateToken);
router.get('/users', getAllUsers);
router.post('/save', saveUsers);
router.patch("/userupdate/:userId", updateUser);
router.delete('/delete/:id', deleteUser);

export default router;
