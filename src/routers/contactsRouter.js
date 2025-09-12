import express from 'express';
import { handleGetContacts, handleGetContactById } from '../controllers/contactsControllers.js';

const router = express.Router();

router.get('/', handleGetContacts);
router.get('/:contactId', handleGetContactById);

export default router;