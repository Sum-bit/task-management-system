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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    const newTask = {
      title,
      description,
      due_date: dueDate,
      priority,
      status,
    };

    axios.post(`${process.env.REACT_APP_API_URL}/tasks/`, newTask, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then(() => {
      toast.success('✅ Task created successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Low');
      setStatus('Pending');
      setTimeout(() => navigate('/'), 1500);
    })
    .catch(err => {
      console.error(err);
      toast.error('❌ Failed to create task');
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">➕ Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        {/* form fields unchanged */}
      </form>
    </div>
  );
};

export default CreateTask;
