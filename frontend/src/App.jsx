import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'incomplete'
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add task
  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks`, { title, description, dueDate });
      fetchTasks(); // Refresh the list
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (id) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}/toggle`);
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true; // 'all'
  });

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <button onClick={() => toggleTaskCompletion(task.id)}>
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;