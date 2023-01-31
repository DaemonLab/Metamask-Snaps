import express from 'express';
import {
  getUser,
  getContact,
  addContact,
  updateContact,
  deleteContact,
} from '../controllers/user.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();

router.route('/:user').get(JwtGuard, getUser);
router
  .route('/contacts')
  .get(JwtGuard, getContact)
  .post(JwtGuard, addContact)
  .put(JwtGuard, updateContact)
  .delete(JwtGuard, deleteContact);

export default router;
