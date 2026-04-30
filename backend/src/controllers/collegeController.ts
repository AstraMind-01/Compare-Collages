import { Request, Response } from 'express';
import { query } from '../config/db';

export const getColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, location, minFees, maxFees, page = '1', limit = '10' } = req.query;
    
    let queryStr = 'SELECT * FROM colleges WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryStr += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (location) {
      queryStr += ` AND location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (minFees) {
      queryStr += ` AND fees >= $${paramIndex}`;
      params.push(Number(minFees));
      paramIndex++;
    }

    if (maxFees) {
      queryStr += ` AND fees <= $${paramIndex}`;
      params.push(Number(maxFees));
      paramIndex++;
    }

    // Count total before pagination
    const countResult = await query(`SELECT COUNT(*) FROM (${queryStr}) as total`, params);
    const total = parseInt(countResult.rows[0].count);

    const offset = (Number(page) - 1) * Number(limit);
    queryStr += ` ORDER BY rating DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(Number(limit), offset);

    const result = await query(queryStr, params);

    res.json({
      data: result.rows,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getCollegeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM colleges WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'College not found' });
      return;
    }

    const college = result.rows[0];
    
    const coursesResult = await query('SELECT * FROM courses WHERE college_id = $1', [id]);
    college.courses = coursesResult.rows;

    res.json(college);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
