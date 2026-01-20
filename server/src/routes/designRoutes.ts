import { Router } from 'express';
import {
    createDesign,
    getDesignsByWorkspace,
    updateDesign,
    getDesignById,
    getUserDesigns,
    getDesignsByTeam,
    togglePublic,
    getPublicDesign
} from '../controllers/designController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public route - No auth required
router.get('/public/:publicId', getPublicDesign);

router.use(authenticateToken);

router.post('/', createDesign);
router.post('/:id/share', togglePublic);
router.get('/workspace/:workspaceId', getDesignsByWorkspace);
router.get('/team/:teamId', getDesignsByTeam);
router.get('/mine', getUserDesigns);
router.get('/:id', getDesignById);
router.put('/:id', updateDesign);

export default router;
