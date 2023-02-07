import express from 'express';
import {
  getUser,
  updateUser,
} from '../controllers/user.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();
router.use(JwtGuard);

router.route('/')
  .get(getUser)
  .post(updateUser);


export default router;
