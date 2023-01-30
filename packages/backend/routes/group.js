import express from 'express';
const router = express.Router();

import { addSplit } from '../controllers/group.js';

router.route('/').post(addGroup).get(listGroup);
router.route(':gid/split').post(addSplit).get(listSplit);
router.route(':gid/split/:sid').delete(deleteSplit).put(updateSplit).get(getSplits);
router.route('')

export default router;
