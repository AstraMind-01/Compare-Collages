import { Request, Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const saveCollegeSchema = z.object({
  collegeId: z.string().uuid(),
});

export const saveCollege = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { collegeId } = saveCollegeSchema.parse(req.body);

    // Check if college exists
    const collegeExists = await query('SELECT id FROM colleges WHERE id = $1', [collegeId]);
    if (collegeExists.rows.length === 0) {
      res.status(404).json({ message: 'College not found' });
      return;
    }

    // Insert into saved_colleges
    await query(
      'INSERT INTO saved_colleges (user_id, college_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, collegeId]
    );

    res.status(201).json({ message: 'College saved successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }
};

export const getSavedColleges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const sqlQuery = `
      SELECT c.*, sc.id as saved_id, sc.created_at as saved_at 
      FROM saved_colleges sc
      JOIN colleges c ON sc.college_id = c.id
      WHERE sc.user_id = $1
      ORDER BY sc.created_at DESC
    `;

    const result = await query(sqlQuery, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
