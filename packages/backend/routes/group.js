import express from 'express';
import {
  addGroup,
  listGroups,
  addMember,
  getGroup,
  settleup,
  getGraph,
} from '../controllers/group.js';
import { JwtGuard } from '../middleware/auth.js';

const router = express.Router();
router.use(JwtGuard);

router.route('/').post(addGroup).get(listGroups);
router.route('/:gid').get(getGroup);
router.route('/add').post(addMember);

router.route('/:gid/settle').post(settleup)
router.route('/:gid/graph').get(getGraph);

export default router;
