import { Router } from "express";
import { getTimeToken, login, updateToken, authenticateToken, getAllUsers, saveUsers, updateUser, deleteUser } from "../controllers/auth.controllers";
import { createOrder, payOrder, cancelOrder } from '../controllers/order.controller';
import { getProductos, createProducto, updateProducto, deleteProducto } from "../controllers/productos.controller";

const router = Router();

router.post('/login', login);
router.get('/getTime', authenticateToken, getTimeToken);
router.patch('/update/:userId', updateToken);
router.get('/users', getAllUsers);
router.post('/save', saveUsers);
router.patch("/userupdate/:userId", updateUser);
router.delete('/delete/:id', deleteUser);

router.post('/orders', createOrder);
router.put('/orders/:id/pay', payOrder);
router.delete('/orders/:id', cancelOrder);

router.get("/productos", getProductos);
router.post("/createproduct", createProducto);
router.put("/updateproduct/:id", updateProducto);
router.delete("/deleteproduct/:id", deleteProducto);

export default router;
