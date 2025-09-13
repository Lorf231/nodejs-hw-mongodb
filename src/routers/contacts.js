import express from 'express';
import {
  handleGetContacts,
  handleGetContactById,
  handleCreateContact,
  handlePatchContact,
  handleDeleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsShema.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(handleGetContacts));
router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));
router.post('/', validateBody(createContactSchema), ctrlWrapper(handleCreateContact));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(handlePatchContact));
router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default router;