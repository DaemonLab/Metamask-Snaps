import express from 'express';
import {
  getSplit,
  deleteSplit,
  updateSplit,
  addSplit,
  listSplits,
} from '../controllers/split.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();
router.use(JwtGuard);

router.route('/:gid').post(addSplit).get(listSplits);
router.route('/:gid/:sid')
  .delete(deleteSplit)
  .put(updateSplit)
  .get(getSplit)

export default router;
