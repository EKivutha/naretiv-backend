import express from 'express';
import { createMessageHandler, deleteMessageHandler, getAllMessages, getMessageHandler, updateMessageHandler } from '../controller/message';
import { getMeHandler } from '../controller/UserController';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get all Messages
router.get('/messages', getAllMessages);

//create a new post
router.post('/create', createMessageHandler);

//retrieve a single Message
router.get('/message/:id', getMessageHandler);

//update a Message
router.patch('/message/:id', updateMessageHandler);

//delete a Message
router.delete('/message/:id', deleteMessageHandler);

export default router;
