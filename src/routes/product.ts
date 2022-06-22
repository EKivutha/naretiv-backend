import express from 'express';
import { createProductHandler, deleteProductHandler, getAllProducts, getProductHandler, updateProductHandler } from '../controller/product';
import { getMeHandler } from '../controller/UserController';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get all products
router.get('/products', getAllProducts);

//create a new post
router.post('/create', createProductHandler);

//retrieve a single product
router.get('/product/:id', getProductHandler);

//update a product
router.patch('/product/:id', updateProductHandler);

//delete a product
router.delete('/product/:id', deleteProductHandler);

export default router;
