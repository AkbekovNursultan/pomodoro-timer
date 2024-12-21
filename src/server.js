import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import express from 'express';

const app = express();
const port = 5172;

const pool = new Pool({
  host: 'localhost',
  port: 5434,
  user: 'postgres',
  password: '1234',
  database: 'pomodoro',
});
app.use(cors());
app.use(express.json());

app.post('/api/save-session', async (req, res) => {
  const { work_time, break_time } = req.body;

  if (!work_time || !break_time) {
    return res.status(400).json({ message: 'Work time and break time are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO records (work_time, break_time) VALUES ($1, $2)',
      [work_time, break_time]
    );

    res.status(200).json({
      message: 'Session saved successfully!',
      record: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving session to DB:', error);
    res.status(500).json({ message: 'Failed to save session data to database.' });
  }
});

app.get('/hello', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
