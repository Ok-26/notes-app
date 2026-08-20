import { useEffect, useMemo, useState } from "react";
import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("notes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [darkMode, setDarkMode] = useState(false);

  // Currently editing note
  const [editingNote, setEditingNote] = useState(null);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // ================================
  // ADD NOTE
  // ================================
  const addNote = (title, content) => {
    if (!title.trim() && !content.trim()) {
      return;
    }

    const newNote = {
      id: Date.now(),
      title: title.trim() || "Untitled Note",
      content: content.trim() || "No content",
      date: new Date().toISOString(),
    };

    setNotes((previous) => [newNote, ...previous]);
  };

  // ================================
  // DELETE NOTE
  // ================================
  const deleteNote = (id) => {
    const note = notes.find((item) => item.id === id);

    if (!note) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${note.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setNotes((previous) =>
      previous.filter((item) => item.id !== id)
    );

    // If deleted note was being edited
    if (editingNote?.id === id) {
      setEditingNote(null);
    }
  };

  // ================================
  // START EDIT
  // ================================
  const startEditing = (note) => {
    setEditingNote(note);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================================
  // UPDATE NOTE
  // ================================
  const updateNote = (id, title, content) => {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === id
          ? {
              ...note,
              title: title.trim() || "Untitled Note",
              content: content.trim() || "No content",
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );

    setEditingNote(null);
  };

  // ================================
  // FILTER + SORT
  // ================================
  const filteredNotes = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    });

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }

      return new Date(a.date) - new Date(b.date);
    });

    return result;
  }, [notes, search, sortOrder]);

  // ================================
  // STATISTICS
  // ================================
  const todayNotes = notes.filter((note) => {
    const noteDate = new Date(note.date);
    const today = new Date();

    return noteDate.toDateString() === today.toDateString();
  }).length;

  const weekNotes = notes.filter((note) => {
    const noteDate = new Date(note.date);
    const now = new Date();

    const difference = now - noteDate;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    return difference <= sevenDays;
  }).length;

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-logo">✦</div>

            <div>
              <h1>Notes</h1>
              <p>Your ideas, organized.</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="header-count">
              <strong>{notes.length}</strong>
              <span>
                {notes.length === 1 ? "Note" : "Notes"}
              </span>
            </div>

            <button
              className="theme-button"
              onClick={() =>
                setDarkMode((value) => !value)
              }
              title="Toggle theme"
            >
              {darkMode ? "☀" : "☼"}
            </button>

            <button
              className="header-new-button"
              onClick={() => {
                setEditingNote(null);

                document
                  .querySelector(".title-input")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });

                setTimeout(() => {
                  document
                    .querySelector(".title-input")
                    ?.focus();
                }, 400);
              }}
            >
              <span>+</span>
              New Note
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <span className="hero-label">
              PERSONAL SPACE
            </span>

            <h2>
              Capture your
              <br />
              <span>thoughts.</span>
            </h2>

            <p>
              Write down ideas, reminders, tasks and anything
              <br className="desktop-break" />
              you don't want to forget.
            </p>
          </div>

          <div className="hero-illustration">
            <div className="glow-circle"></div>

            <div className="notebook">
              <div className="spiral">
                ••••••••
              </div>

              <div className="paper-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="pen">✎</div>

            <div className="hero-star star-one">
              ✦
            </div>

            <div className="hero-star star-two">
              ✦
            </div>
          </div>
        </section>

        {/* NOTE FORM */}
        <NoteForm
          addNote={addNote}
          editingNote={editingNote}
          updateNote={updateNote}
          cancelEdit={() => setEditingNote(null)}
        />

        {/* SEARCH + SORT */}
        <section className="tools-section">
          <div className="search-wrapper">
            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="sort-wrapper">
            <span>☷</span>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>
            </select>

            <span className="select-arrow">
              ⌄
            </span>
          </div>
        </section>

        {/* NOTES + STATS */}
        <section className="notes-layout">
          <div className="notes-area">
            <div className="notes-heading">
              <span>YOUR NOTES</span>

              <h3>
                {search
                  ? `${filteredNotes.length} ${
                      filteredNotes.length === 1
                        ? "result"
                        : "results"
                    }`
                  : `${notes.length} ${
                      notes.length === 1
                        ? "note"
                        : "notes"
                    }`}
              </h3>
            </div>

            <NotesList
              notes={filteredNotes}
              deleteNote={deleteNote}
              editNote={startEditing}
              search={search}
            />
          </div>

          {/* STATISTICS */}
          <aside className="stats-card">
            <div className="stat-item">
              <div className="stat-icon purple">
                ▣
              </div>

              <div>
                <span>Total Notes</span>
                <strong>{notes.length}</strong>
              </div>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">
              <div className="stat-icon green">
                ✓
              </div>

              <div>
                <span>Today</span>
                <strong>{todayNotes}</strong>
              </div>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">
              <div className="stat-icon yellow">
                ★
              </div>

              <div>
                <span>This Week</span>
                <strong>{weekNotes}</strong>
              </div>
            </div>
          </aside>
        </section>

        <div className="bottom-message">
          <span>♥</span>
          Keep writing, keep growing.
        </div>
      </main>
    </div>
  );
}

export default App;