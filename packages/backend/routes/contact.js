import express from 'express';
import {
  getContact,
  addContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();
router.use(JwtGuard);

router.route('/')
  .get(getContact)
  .post(addContact)
  .put(updateContact)
  .delete(deleteContact);

export default router;
