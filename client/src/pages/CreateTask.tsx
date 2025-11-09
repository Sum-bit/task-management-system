import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/auth';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [status, setStatus] = useState('Pending');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    if (!token) {
      toast.error('You are not logged in!');
      navigate('/login');
      return;
    }

    const newTask = {
      title,
      description,
      due_date: dueDate,
      priority,
      status,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/tasks/', newTask, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('✅ Task created successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Low');
      setStatus('Pending');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create task');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient-custom p-4">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4 fw-bold">➕ Create a New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              rows={3}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Priority:</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div className="col">
              <label className="form-label">Status:</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
