import { Router } from 'express';
import { getActivities } from '../controllers/activityController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getActivities);

export default router;
