import { colleges } from '../seedData'; // we will extract colleges to a separate file
import { v4 as uuidv4 } from 'uuid';

export const mockDb = {
  users: [] as any[],
  colleges: colleges.map((c: any) => ({ ...c, id: uuidv4() })),
  courses: [] as any[],
  saved_colleges: [] as any[],
};

export const mockQuery = async (text: string, params?: any[]): Promise<any> => {
  // Simple mock logic for MVP fallback
  
  if (text.includes('SELECT COUNT(*) FROM (SELECT * FROM colleges')) {
    return { rows: [{ count: mockDb.colleges.length.toString() }] };
  }

  if (text.includes('SELECT * FROM colleges WHERE 1=1')) {
    let result = [...mockDb.colleges];
    
    if (params && params.length > 0) {
      // Very basic filtering mock
      const search = params.find(p => typeof p === 'string' && p.startsWith('%'));
      if (search) {
        const term = search.replace(/%/g, '').toLowerCase();
        result = result.filter(c => c.name.toLowerCase().includes(term));
      }
    }

    // Pagination support
    const match = text.match(/LIMIT \$(\d+) OFFSET \$(\d+)/);
    if (match && params) {
      const limitIndex = parseInt(match[1]) - 1;
      const offsetIndex = parseInt(match[2]) - 1;
      const limit = params[limitIndex];
      const offset = params[offsetIndex];
      result = result.slice(offset, offset + limit);
    }
    
    return { rows: result };
  }

  if (text.includes('SELECT * FROM colleges WHERE id = $1')) {
    const college = mockDb.colleges.find(c => c.id === params?.[0]);
    return { rows: college ? [college] : [] };
  }

  if (text.includes('SELECT * FROM courses WHERE college_id = $1')) {
    return { rows: mockDb.courses.filter(c => c.college_id === params?.[0]) };
  }

  // Auth Mocks
  if (text.includes('INSERT INTO users')) {
    const newUser = { id: uuidv4(), email: params?.[0], password_hash: params?.[1] };
    mockDb.users.push(newUser);
    return { rows: [newUser] };
  }

  if (text.includes('SELECT * FROM users WHERE email = $1')) {
    const user = mockDb.users.find(u => u.email === params?.[0]);
    return { rows: user ? [user] : [] };
  }

  // Saved Colleges Mocks
  if (text.includes('INSERT INTO saved_colleges')) {
    const saved = { id: uuidv4(), user_id: params?.[0], college_id: params?.[1], created_at: new Date() };
    mockDb.saved_colleges.push(saved);
    return { rows: [saved] };
  }

  if (text.includes('SELECT c.*, sc.id as saved_id')) {
    const saved = mockDb.saved_colleges.filter(sc => sc.user_id === params?.[0]);
    const result = saved.map(sc => {
      const college = mockDb.colleges.find(c => c.id === sc.college_id);
      return { ...college, saved_id: sc.id, saved_at: sc.created_at };
    });
    return { rows: result };
  }

  return { rows: [] };
};
