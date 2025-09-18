import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Dashboard.css';

// 🔧 Helper to get token from localStorage
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    toast.error('⚠️ No token found. Please log in again.');
  }
  return token;
};

interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Ongoing' | 'Completed';
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterAndSortTasks();
  }, [searchTerm, sortBy, filterStatus, filterPriority, tasks]);

  const fetchTasks = () => {
    const token = getAuthToken();
    if (!token) return;

    axios.get(`${process.env.REACT_APP_API_URL}/tasks/`, {
      headers: { Authorization: `Token ${token}` },
    })
    .then(res => setTasks(res.data))
    .catch(err => {
      console.error(err);
      toast.error('❌ Failed to fetch tasks');
    });
  };

  const handleDelete = () => {
    const token = getAuthToken();
    if (!token || taskToDelete === null) return;

    axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${taskToDelete}/`, {
      headers: { Authorization: `Token ${token}` },
    })
    .then(() => {
      setTasks(prev => prev.filter(task => task.id !== taskToDelete));
      toast.success('🗑️ Task deleted successfully');
      setShowModal(false);
      setTaskToDelete(null);
    })
    .catch(() => toast.error('❌ Failed to delete task'));
  };

  const handleEditSubmit = () => {
    const token = getAuthToken();
    if (!token || !editingTask) return;

    axios.put(`${process.env.REACT_APP_API_URL}/tasks/${editingTask.id}/`, editingTask, {
      headers: { Authorization: `Token ${token}` },
    })
    .then(() => {
      toast.success('✏️ Task updated successfully');
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
    })
    .catch(() => toast.error('❌ Failed to update task'));
  };

  const filterAndSortTasks = () => {
    let updatedTasks = [...tasks];

    if (searchTerm) {
      updatedTasks = updatedTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      updatedTasks = updatedTasks.filter(task => task.status === filterStatus);
    }

    if (filterPriority) {
      updatedTasks = updatedTasks.filter(task => task.priority === filterPriority);
    }

    if (sortBy === 'due_date') {
      updatedTasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    } else if (sortBy === 'priority') {
      const order = { Low: 1, Medium: 2, High: 3 };
      updatedTasks.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    setFilteredTasks(updatedTasks);
  };

  const confirmDelete = (id: number) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingTask) return;
    const { name, value } = e.target;
    setEditingTask({ ...editingTask, [name]: value });
  };

  const getStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case 'Pending': return 'bg-danger';
      case 'Ongoing': return 'bg-warning text-dark';
      case 'Completed': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getPriorityBadgeClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'Low': return 'bg-success';
      case 'Medium': return 'bg-warning text-dark';
      case 'High': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <>
      <div className={`container mt-5 ${showModal || showEditModal ? 'blur-background' : ''}`}>
        <h2 className="mb-4">📝 Task Dashboard</h2>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <input
            type="text"
            className="form-control w-100 w-md-25"
            placeholder="🔍 Search by title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select w-100 w-md-20"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="form-select w-100 w-md-20"
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
          >
            <option value="">Filter by Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            className="form-select w-100 w-md-20"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map(task => (
            <div className="card mb-3" key={task.id}>
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-text">{task.description}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>{' '}
                  | <strong>Priority:</strong>{' '}
                  <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>{task.priority}</span>
                </p>
                <p><strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}</p>
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(task)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(task.id)}>
                    ❌ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h4>Are you sure you want to delete this task?</h4>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTask && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h4>Edit Task</h4>
            <input
              type="text"
              className="form-control mb-2"
              name="title"
              value={editingTask.title}
              onChange={handleEditChange}
              placeholder="Title"
            />
            <textarea
              className="form-control mb-2"
              name="description"
              value={editingTask.description}
              onChange={handleEditChange}
              placeholder="Description"
            />
            <input
              type="date"
              className="form-control mb-2"
              name="due_date"
              value={editingTask.due_date}
              onChange={handleEditChange}
            />
            <select
              className="form-control mb-2"
              name="priority"
              value={editingTask.priority}
              onChange={handleEditChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              className="form-control mb-2"
              name="status"
              value={editingTask.status}
              onChange={handleEditChange}
            >
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
