import express from 'express';
import { createOrderHandler, deleteOrderHandler, getAllOrders, getOrderHandler, payoutOrderHandler, updateOrderHandler } from '../controller/order';
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
router.get('/order/:id', getOrderHandler);

//update a orders
router.patch('/update/:id', updateOrderHandler);

//payout an order
router.patch('/payout/:id', payoutOrderHandler);

//delete an orders
router.delete('/order/:id', deleteOrderHandler);

export default router;
