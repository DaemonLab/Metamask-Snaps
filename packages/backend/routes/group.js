import express from 'express';
import {
  addSplit,
  deleteSplit,
  updateSplit,
  addGroup,
  listSplits,
  listGroups,
} from '../controllers/group.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();
router.use(JwtGuard);

router.route('/').post(addGroup).get(listGroups);
router.route(':gid/split').post(addSplit).get(listSplits);
router
  .route(':gid/split/:sid')
  .delete(deleteSplit)
  .put(updateSplit);
// .get(getSplit);

export default router;
