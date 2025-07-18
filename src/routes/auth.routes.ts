import { Router } from "express";
import { getTimeToken, login, updateToken, authenticateToken, getAllUsers, saveUsers, updateUser, deleteUser, updateModal } from "../controllers/auth.controllers";
import { getOrders, createOrder, payOrder, cancelOrder, updateOrder } from '../controllers/order.controller';
import { getProductos, createProducto, updateProducto, deleteProducto } from "../controllers/product.controller";

const router = Router();

router.post('/login', login);
router.get('/getTime', authenticateToken, getTimeToken);
router.patch('/update/:userId', updateToken);
router.get('/users', getAllUsers);
router.post('/save', saveUsers);
router.patch("/userupdate/:userId", updateUser);
router.delete('/delete/:id', deleteUser);
router.put('/users/:id', updateModal);

router.get('/allorders', getOrders);
router.post('/orders', createOrder);
router.put('/orders/:id/pay', payOrder);
router.delete('/orders/:id', cancelOrder);
router.put('/updateorders/:id', updateOrder);

router.get("/allproductos", getProductos);
router.post("/createproduct", createProducto);
router.put("/updateproduct/:id", updateProducto);
router.delete("/deleteproduct/:id", deleteProducto);

export default router;
