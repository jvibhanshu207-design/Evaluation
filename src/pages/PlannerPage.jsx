import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Calendar
} from 'lucide-react';
import { DEMO_PLANNER_TASKS } from '../data/demoPlanner';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import Modal from '../components/common/Modal';
import { sound } from '../utils/sound';
import './PlannerPage.css';

export default function PlannerPage() {
  const [tasks, setTasks] = useState(() =>
    getStoredData(STORAGE_KEYS.PLANNER, DEMO_PLANNER_TASKS)
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'High' | 'Pending' | 'Completed'

  // New Task Form
  const [subject, setSubject] = useState('Java Programming');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-07');
  const [time, setTime] = useState('18:00');
  const [priority, setPriority] = useState('High');

  useEffect(() => {
    setStoredData(STORAGE_KEYS.PLANNER, tasks);
  }, [tasks]);

  const handleToggleTask = (id) => {
    sound.playClick();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id) => {
    sound.playClick();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playClick();
    const newTask = {
      id: `task-${Date.now()}`,
      subject,
      title: title.trim(),
      date,
      time,
      priority,
      completed: false
    };

    setTasks((prev) => [newTask, ...prev]);
    setTitle('');
    setIsAddModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'High') return t.priority === 'High';
    if (activeFilter === 'Pending') return !t.completed;
    if (activeFilter === 'Completed') return t.completed;
    return true;
  });

  const getPriorityLabel = (p) => {
    switch (p) {
      case 'High':
        return '🔴 High Priority';
      case 'Medium':
        return '🟡 Medium Priority';
      case 'Low':
      default:
        return '🟢 Low Priority';
    }
  };

  const getPriorityClass = (p) => {
    switch (p) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
      default:
        return 'priority-low';
    }
  };

  return (
    <div className="planner-container">
      {/* Header Banner */}
      <div className="glass-panel page-banner">
        <div>
          <div className="page-tag">
            <CalendarCheck size={20} color="var(--primary-purple)" />
            <span>Academic Schedule Engine</span>
          </div>
          <h1 className="page-title">
            Smart Study Planner
          </h1>
          <p className="page-subtitle">
            Organize study sessions, exam revisions, and homework milestones across subjects with automated priority scheduling.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="gradient-border-btn"
          style={{ padding: '10px 22px' }}
        >
          <Plus size={16} />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="planner-tabs">
        {['All', 'High', 'Pending', 'Completed'].map((tab) => {
          const isSelected = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`planner-tab-btn ${isSelected ? 'active' : ''}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Timeline Style Tasks List */}
      <div className="planner-tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No study tasks in this category. Click "Add Study Task" to schedule your next session!
          </div>
        ) : (
          filteredTasks.map((t) => {
            return (
              <div
                key={t.id}
                className={`glass-panel glass-panel-hover planner-task-item ${t.completed ? 'completed' : ''} ${getPriorityClass(t.priority)}`}
              >
                <div className="planner-task-content">
                  <button
                    onClick={() => handleToggleTask(t.id)}
                    className="planner-toggle-btn"
                    style={{ color: t.completed ? 'var(--emerald-accent)' : 'var(--text-muted)' }}
                  >
                    {t.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>

                  <div style={{ minWidth: 0 }}>
                    <h3
                      className={`planner-task-title ${t.completed ? 'completed' : ''}`}
                      style={{ color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}
                    >
                      {t.title}
                    </h3>

                    <div className="planner-task-meta">
                      <span>Subject: <strong style={{ color: 'var(--text-primary)' }}>{t.subject}</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {t.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        {t.time}
                      </span>
                      <span style={{ fontWeight: 700 }}>
                        {getPriorityLabel(t.priority)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(t.id)}
                  className="planner-delete-btn"
                  title="Delete task"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Study Task"
        subtitle="Set clear milestones and priorities for your academic calendar"
        maxWidth="520px"
      >
        <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
            >
              <option value="Java Programming">Java Programming</option>
              <option value="React Development">React Development</option>
              <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
              <option value="Python Fundamentals">Python Fundamentals</option>
              <option value="Database Management">Database Management</option>
              <option value="Web Development">Web Development</option>
              <option value="General Academic">General Academic</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Task Description
            </label>
            <input
              type="text"
              placeholder="e.g. Implement Binary Search Tree Insertion and take Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-input"
            >
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Low">🟢 Low Priority</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="glass-btn"
              style={{ padding: '9px 18px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-border-btn"
              style={{ padding: '9px 22px' }}
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
