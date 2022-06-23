import express from 'express';
import { createOrderHandler, deleteOrderHandler, getAllOrders, getOrderHandler, updateOrderHandler } from '../controller/order';
import { getMeHandler } from '../controller/UserController';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get all Orders
router.get('/orders', getAllOrders);

//create a new post
router.post('/create', createOrderHandler);

//retrieve a single orders
router.get('/orders/:id', getOrderHandler);

//update a orders
router.patch('/orders/:id', updateOrderHandler);

//delete a orders
router.delete('/orders/:id', deleteOrderHandler);

export default router;
