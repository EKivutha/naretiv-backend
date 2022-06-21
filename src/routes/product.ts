import express from 'express';
import { getMeHandler } from '../controller/UserController';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get all products
router.get('/products', getMeHandler);

//create a new post
router.post('/products', getMeHandler);

//retrieve a single product
router.get('/products/:id', getMeHandler);

//update a product
router.patch('/products/:id', getMeHandler);

//delete a product
router.delete('/products/:id', getMeHandler);

export default router;
