import express from 'express';
import {
  getSolanaAddressDetail,
  createSolanaTransaction,
} from '../controllers/solana.js';
import {
  getTronAddressDetail,
  createTronTransaction,
} from '../controllers/tron.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();
router.use(JwtGuard);

router.route('/solana/address').post(getSolanaAddressDetail);
router.route('/solana/transaction').post(createSolanaTransaction);
router.route('/tron/address').post(getTronAddressDetail);
router.route('/tron/transaction').post(createTronTransaction);

export default router;
