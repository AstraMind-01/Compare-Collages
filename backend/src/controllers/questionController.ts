import { Request, Response } from 'express';
import { query } from '../config/db';
import { z } from 'zod';

const questionSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
});

const answerSchema = z.object({
  content: z.string().min(2),
});

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT q.*, u.email FROM questions q JOIN users u ON q.user_id = u.id ORDER BY q.created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: (error as Error).message });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const qResult = await query('SELECT * FROM questions WHERE id = $1', [id]);
    if (qResult.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const aResult = await query(
      'SELECT a.*, u.email FROM answers a JOIN users u ON a.user_id = u.id WHERE a.question_id = $1 ORDER BY a.created_at ASC',
      [id]
    );
    
    res.json({
      ...qResult.rows[0],
      answers: aResult.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error: (error as Error).message });
  }
};

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const validated = questionSchema.parse(req.body);
    const userId = (req as any).user?.id;
    
    const result = await query(
      'INSERT INTO questions (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, validated.title, validated.content]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.issues });
    }
    res.status(500).json({ message: 'Error creating question', error: (error as Error).message });
  }
};

export const createAnswer = async (req: Request, res: Response) => {
  try {
    const { id: questionId } = req.params;
    const validated = answerSchema.parse(req.body);
    const userId = (req as any).user?.id;
    
    const result = await query(
      'INSERT INTO answers (question_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [questionId, userId, validated.content]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.issues });
    }
    res.status(500).json({ message: 'Error creating answer', error: (error as Error).message });
  }
};
