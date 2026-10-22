import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Tag,
  Folder,
  Save,
  Check
} from 'lucide-react';
import { DEMO_NOTES } from '../data/demoNotes';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import { sound } from '../utils/sound';
import './NotesPage.css';

export default function NotesPage() {
  const [notes, setNotes] = useState(() =>
    getStoredData(STORAGE_KEYS.NOTES, DEMO_NOTES)
  );
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditing, setIsEditing] = useState(false);

  // Form State for Active Edit
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('General');
  const [editTags, setEditTags] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setStoredData(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  useEffect(() => {
    if (activeNote) {
      setEditTitle(activeNote.title);
      setEditCategory(activeNote.category || 'General');
      setEditTags(activeNote.tags?.join(', ') || '');
      setEditContent(activeNote.content);
    }
  }, [selectedNoteId]);

  const categories = ['All', 'Java', 'React', 'DSA', 'Python', 'Database', 'Design', 'General'];

  const filteredNotes = notes.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  });

  const handleCreateNote = () => {
    sound.playClick();
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Study Note',
      category: 'General',
      tags: ['Study', 'QuickNote'],
      pinned: false,
      updatedAt: new Date().toISOString(),
      content: '# Untitled Note\n\nStart typing your study notes, code snippets, or thoughts here...'
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    sound.playClick();
    const tagArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId
          ? {
              ...n,
              title: editTitle.trim() || 'Untitled Note',
              category: editCategory,
              tags: tagArray,
              content: editContent,
              updatedAt: new Date().toISOString()
            }
          : n
      )
    );
    setIsEditing(false);
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this study note?')) {
      sound.playClick();
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNoteId === id) {
        const remaining = notes.filter((n) => n.id !== id);
        setSelectedNoteId(remaining[0]?.id || null);
      }
    }
  };

  const handleTogglePin = (id, e) => {
    e.stopPropagation();
    sound.playClick();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  return (
    <div className="notes-container">
      {/* Header */}
      <div className="glass-panel notes-header-bar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FileText size={18} color="var(--primary-purple)" />
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--electric-violet)', textTransform: 'uppercase' }}>
              Digital Knowledge Base
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: 800 }}>
            Study Notebook & Snippets
          </h1>
        </div>

        <button onClick={handleCreateNote} className="gradient-border-btn" style={{ padding: '10px 20px' }}>
          <Plus size={16} />
          <span>New Note</span>
        </button>
      </div>

      {/* Two Column Workspace: Notes List Sidebar + Active Note Editor */}
      <div className="notes-layout-grid">
        {/* LEFT: Notes List */}
        <div className="glass-panel notes-sidebar-panel">
          {/* Search Box */}
          <div className="notes-search-wrap">
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search notes & tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="notes-search-input"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="notes-category-scroll">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`notes-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="notes-list-scroll">
            {sortedNotes.length === 0 ? (
              <div style={{ padding: '30px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                No notes found matching your filter.
              </div>
            ) : (
              sortedNotes.map((note) => {
                const isSelected = note.id === selectedNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setIsEditing(false);
                    }}
                    className={`note-card-item ${isSelected ? 'selected' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <h4
                        className="note-card-title"
                        style={{ color: isSelected ? '#FFFFFF' : 'var(--text-primary)' }}
                      >
                        {note.title}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <button
                          onClick={(e) => handleTogglePin(note.id, e)}
                          style={{
                            color: note.pinned ? 'var(--cyan-accent)' : 'var(--text-muted)',
                            padding: '2px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          title={note.pinned ? 'Unpin' : 'Pin note'}
                        >
                          <Pin size={14} fill={note.pinned ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          onClick={(e) => handleDeleteNote(note.id, e)}
                          style={{ color: 'var(--text-muted)', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}
                          title="Delete note"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="note-card-desc">
                      {note.content.replace(/#|\*|`|\[|\]/g, '')}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                      <span className="note-card-badge">
                        {note.category}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {new Date(note.updatedAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Active Note View / Editor */}
        <div className="glass-panel notes-editor-panel">
          {activeNote ? (
            <div>
              {/* Note Header & Edit / Save Toggle */}
              <div className="notes-editor-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(34, 211, 238, 0.15)',
                      color: 'var(--cyan-accent)',
                      border: '1px solid rgba(34, 211, 238, 0.3)'
                    }}
                  >
                    {activeNote.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Last edited {new Date(activeNote.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {isEditing ? (
                    <button
                      onClick={handleSaveNote}
                      className="gradient-border-btn"
                      style={{ padding: '7px 16px', fontSize: '0.84rem' }}
                    >
                      <Save size={14} />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="glass-btn"
                      style={{ padding: '7px 16px', fontSize: '0.84rem' }}
                    >
                      <Edit3 size={14} />
                      <span>Edit Note</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Editable Fields */}
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Note Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title of this note..."
                      className="notes-editor-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Category
                      </label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="notes-editor-input"
                      >
                        {categories.filter((c) => c !== 'All').map((cat) => (
                          <option key={cat} value={cat} style={{ background: '#10152A', color: 'white' }}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="e.g. Hooks, Performance, Exam"
                        className="notes-editor-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Markdown Content
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={14}
                      className="notes-editor-textarea"
                    />
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '12px'
                    }}
                  >
                    {activeNote.title}
                  </h2>

                  {/* Tags Badges */}
                  {activeNote.tags && activeNote.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                      {activeNote.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Formatted Content */}
                  <div className="notes-view-content">
                    {activeNote.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              Select a note or create a new one to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
