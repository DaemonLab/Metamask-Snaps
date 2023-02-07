import express from 'express';
import {
  getContact,
  addContact,
  deleteContact,
} from '../controllers/contacts.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();
router.use(JwtGuard);

router.route('/')
  .get(getContact)
  .post(addContact)
  .delete(deleteContact);

export default router;
