import { Router } from 'express';
import { saveCollege, getSavedColleges } from '../controllers/savedController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Protect these routes with JWT
router.use(verifyToken);

router.post('/', saveCollege);
router.get('/', getSavedColleges);

export default router;
