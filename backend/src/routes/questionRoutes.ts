import { Router } from 'express';
import { getQuestions, getQuestionById, createQuestion, createAnswer } from '../controllers/questionController';
import { verifyToken } from '../middleware/auth';

const router = Router();

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', verifyToken, createQuestion);
router.post('/:id/answers', verifyToken, createAnswer);


export default router;
