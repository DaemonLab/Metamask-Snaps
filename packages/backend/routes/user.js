import express from 'express';
const router = express.Router();

import {
  getAllUsers,
  addUser,
  getUser,
  updateGeneralDetails,
  publishVersion,
  deleteUser,
} from '../controllers/user.js';

router.route('/').get(getAllUsers).post(addUser);
router.route('/:user').delete(deleteUser).get(getUser)

export default router;
