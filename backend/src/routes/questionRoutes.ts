import { Router } from 'express';
import { getQuestions, getQuestionById, createQuestion, createAnswer } from '../controllers/questionController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', authenticate, createQuestion);
router.post('/:id/answers', authenticate, createAnswer);

export default router;
