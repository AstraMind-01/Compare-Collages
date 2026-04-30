import { pool } from './config/db';
import fs from 'fs';
import path from 'path';

const colleges = [
  { name: 'Indian Institute of Technology (IIT) Bombay', location: 'Mumbai, Maharashtra', fees: 220000, rating: 4.9, description: 'Premier engineering institute known for its excellent placements and campus life.', placement_percentage: 95, courses: [{ name: 'B.Tech Computer Science', duration: '4 Years' }, { name: 'M.Tech Data Science', duration: '2 Years' }] },
  { name: 'Indian Institute of Technology (IIT) Delhi', location: 'New Delhi, Delhi', fees: 215000, rating: 4.8, description: 'Leading institute in research and engineering studies with strong industry connections.', placement_percentage: 94, courses: [{ name: 'B.Tech Electrical Engineering', duration: '4 Years' }] },
  { name: 'National Institute of Technology (NIT) Trichy', location: 'Tiruchirappalli, Tamil Nadu', fees: 150000, rating: 4.7, description: 'Top-ranked NIT offering high-quality education and excellent ROI.', placement_percentage: 92, courses: [{ name: 'B.Tech Mechanical Engineering', duration: '4 Years' }] },
  { name: 'Birla Institute of Technology and Science (BITS)', location: 'Pilani, Rajasthan', fees: 450000, rating: 4.8, description: 'Highly reputed private institution with zero attendance policy and brilliant alumni.', placement_percentage: 96, courses: [{ name: 'B.E. Computer Science', duration: '4 Years' }, { name: 'B.E. Electronics', duration: '4 Years' }] },
  { name: 'Vellore Institute of Technology (VIT)', location: 'Vellore, Tamil Nadu', fees: 198000, rating: 4.2, description: 'Known for its massive campus, diverse student body, and strong IT placements.', placement_percentage: 85, courses: [{ name: 'B.Tech Information Technology', duration: '4 Years' }] },
  { name: 'Delhi Technological University (DTU)', location: 'New Delhi, Delhi', fees: 166000, rating: 4.5, description: 'Formerly DCE, famous for exceptional tech culture and massive tech placements.', placement_percentage: 90, courses: [{ name: 'B.Tech Software Engineering', duration: '4 Years' }] },
  { name: 'SRM Institute of Science and Technology', location: 'Chennai, Tamil Nadu', fees: 250000, rating: 4.0, description: 'Large multi-stream university with vast infrastructure and global tie-ups.', placement_percentage: 82, courses: [{ name: 'B.Tech CSE', duration: '4 Years' }] },
  { name: 'Manipal Institute of Technology (MIT)', location: 'Manipal, Karnataka', fees: 335000, rating: 4.3, description: 'Vibrant college life, state-of-the-art facilities, and strong alumni network.', placement_percentage: 84, courses: [{ name: 'B.Tech Aeronautical', duration: '4 Years' }] },
  { name: 'College of Engineering, Pune (COEP)', location: 'Pune, Maharashtra', fees: 90000, rating: 4.6, description: 'One of the oldest engineering colleges in Asia with excellent academics.', placement_percentage: 88, courses: [{ name: 'B.Tech Instrumentation', duration: '4 Years' }] },
  { name: 'Indian Institute of Technology (IIT) Madras', location: 'Chennai, Tamil Nadu', fees: 210000, rating: 4.9, description: 'Top ranked engineering college in India consistently by NIRF.', placement_percentage: 93, courses: [{ name: 'B.Tech Aerospace', duration: '4 Years' }] },
  { name: 'National Institute of Technology (NIT) Surathkal', location: 'Surathkal, Karnataka', fees: 145000, rating: 4.7, description: 'Coastal campus offering excellent technical education.', placement_percentage: 91, courses: [{ name: 'B.Tech IT', duration: '4 Years' }] },
  { name: 'Jadavpur University', location: 'Kolkata, West Bengal', fees: 10000, rating: 4.6, description: 'Exceptional ROI with very low fees and outstanding placement records.', placement_percentage: 90, courses: [{ name: 'B.E. Computer Science', duration: '4 Years' }] },
  { name: 'International Institute of Information Technology (IIIT) Hyderabad', location: 'Hyderabad, Telangana', fees: 300000, rating: 4.8, description: 'Best-in-class coding culture and research facilities in India.', placement_percentage: 98, courses: [{ name: 'B.Tech CSE', duration: '4 Years' }] },
  { name: 'RV College of Engineering', location: 'Bengaluru, Karnataka', fees: 120000, rating: 4.4, description: 'Top college in Karnataka through COMEDK/KCET with prime location advantage.', placement_percentage: 87, courses: [{ name: 'B.E. Information Science', duration: '4 Years' }] },
  { name: 'Netaji Subhas University of Technology (NSUT)', location: 'New Delhi, Delhi', fees: 166000, rating: 4.5, description: 'Known for producing excellent coders and high placement packages.', placement_percentage: 89, courses: [{ name: 'B.Tech Computer Engineering', duration: '4 Years' }] },
  { name: 'PSG College of Technology', location: 'Coimbatore, Tamil Nadu', fees: 85000, rating: 4.5, description: 'Industry-integrated learning with strong manufacturing and software placements.', placement_percentage: 88, courses: [{ name: 'B.E. Robotics', duration: '4 Years' }] },
  { name: 'Thapar Institute of Engineering and Technology', location: 'Patiala, Punjab', fees: 350000, rating: 4.3, description: 'Oldest private engineering college in North India with vast campus.', placement_percentage: 85, courses: [{ name: 'B.E. Computer Science', duration: '4 Years' }] },
  { name: 'National Institute of Technology (NIT) Warangal', location: 'Warangal, Telangana', fees: 155000, rating: 4.6, description: 'First NIT established, highly reputed for CSE and ECE branches.', placement_percentage: 92, courses: [{ name: 'B.Tech Electronics', duration: '4 Years' }] },
  { name: 'Symbiosis Institute of Technology', location: 'Pune, Maharashtra', fees: 280000, rating: 4.0, description: 'Modern infrastructure with growing placement records.', placement_percentage: 80, courses: [{ name: 'B.Tech AI & ML', duration: '4 Years' }] },
  { name: 'Amrita Vishwa Vidyapeetham', location: 'Coimbatore, Tamil Nadu', fees: 250000, rating: 4.2, description: 'Values-based education with strong research focus and good placements.', placement_percentage: 83, courses: [{ name: 'B.Tech CSE', duration: '4 Years' }] },
];

async function seed() {
  try {
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    console.log('Running init.sql...');
    await pool.query(initSql);
    
    console.log('Checking existing data...');
    const { rows } = await pool.query('SELECT COUNT(*) FROM colleges');
    if (parseInt(rows[0].count) > 0) {
      console.log('Database already seeded. Skipping.');
      process.exit(0);
    }

    console.log('Seeding colleges and courses...');
    for (const college of colleges) {
      const insertCollege = `
        INSERT INTO colleges (name, location, fees, rating, description, placement_percentage)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
      `;
      const values = [college.name, college.location, college.fees, college.rating, college.description, college.placement_percentage];
      const result = await pool.query(insertCollege, values);
      const collegeId = result.rows[0].id;

      for (const course of college.courses) {
        await pool.query(
          'INSERT INTO courses (college_id, name, duration) VALUES ($1, $2, $3)',
          [collegeId, course.name, course.duration]
        );
      }
    }
    
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
