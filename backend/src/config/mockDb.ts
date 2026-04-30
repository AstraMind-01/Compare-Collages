import { colleges } from '../seedData'; // we will extract colleges to a separate file
import { v4 as uuidv4 } from 'uuid';

export const mockDb = {
  users: [] as any[],
  colleges: colleges.map((c: any) => ({ ...c, id: uuidv4() })),
  courses: [] as any[],
  saved_colleges: [] as any[],
  questions: [] as any[],
  answers: [] as any[],
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
    const newUser = { 
      id: uuidv4(), 
      email: params?.[0], 
      name: params?.[1] || null,
      picture: params?.[2] || null,
      provider: params?.[3] || 'email',
      password_hash: params?.[4] || null
    };
    mockDb.users.push(newUser);
    return { rows: [newUser] };
  }




  if (text.includes('SELECT * FROM users WHERE email = $1')) {
    const searchEmail = params?.[0];
    if (!searchEmail) return { rows: [] };
    
    const user = mockDb.users.find(u => 
      u.email && u.email.toLowerCase() === searchEmail.toLowerCase()
    );
    
    console.log(`Mock DB: Searching for user ${searchEmail} -> ${user ? 'FOUND' : 'NOT FOUND'}`);
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

  // Q&A Mocks
  if (text.includes('INSERT INTO questions')) {
    const question = { id: uuidv4(), user_id: params?.[0], title: params?.[1], content: params?.[2], created_at: new Date() };
    mockDb.questions.push(question);
    return { rows: [question] };
  }

  if (text.includes('SELECT q.*, u.email')) {
    // Return all questions
    return { rows: mockDb.questions.map(q => ({ ...q, email: mockDb.users.find(u => u.id === q.user_id)?.email || 'anon' })) };
  }

  if (text.includes('SELECT * FROM questions WHERE id = $1')) {
    const q = mockDb.questions.find(q => q.id === params?.[0]);
    return { rows: q ? [q] : [] };
  }

  if (text.includes('INSERT INTO answers')) {
    const answer = { id: uuidv4(), question_id: params?.[0], user_id: params?.[1], content: params?.[2], created_at: new Date() };
    mockDb.answers.push(answer);
    return { rows: [answer] };
  }

  if (text.includes('SELECT a.*, u.email')) {
    const answers = mockDb.answers.filter(a => a.question_id === params?.[0]);
    return { rows: answers.map(a => ({ ...a, email: mockDb.users.find(u => u.id === a.user_id)?.email || 'anon' })) };
  }

  return { rows: [] };
};

