import { Router } from 'express';
import { createTeam, getMyTeams, createWorkspace, getWorkspacesByTeam, joinTeam } from '../controllers/teamController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/teams', createTeam);
router.get('/teams', getMyTeams);
router.post('/teams/join', joinTeam);
router.post('/workspaces', createWorkspace);
router.get('/teams/:teamId/workspaces', getWorkspacesByTeam);

export default router;
