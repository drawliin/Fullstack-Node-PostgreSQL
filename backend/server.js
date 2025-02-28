const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mydb'
});

// Routes
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *',
      [title, description, dueDate]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/tasks/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const backendport = process.env.PORT || 4002;
app.listen(backendport, () => {
  console.log(`Server running on port ${backendport}`);
});