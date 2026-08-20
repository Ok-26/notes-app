import { useEffect, useState } from "react";

function NoteForm({
  addNote,
  editingNote,
  updateNote,
  cancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Load note when editing
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);

      setTimeout(() => {
        document.querySelector(".title-input")?.focus();
      }, 100);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  // Add / Update
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() && !content.trim()) {
      return;
    }

    if (editingNote) {
      updateNote(
        editingNote.id,
        title,
        content
      );
    } else {
      addNote(title, content);
    }

    setTitle("");
    setContent("");
  };

  // Cancel editing
  const handleCancel = () => {
    setTitle("");
    setContent("");
    cancelEdit();
  };

  return (
    <section
      className={`composer-card ${
        editingNote ? "editing-mode" : ""
      }`}
    >
      <form onSubmit={handleSubmit}>
        {/* EDITING BANNER */}
        {editingNote && (
          <div className="editing-banner">
            <div>
              <span className="editing-dot"></span>
              Editing note
            </div>

            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="composer-main">
          {/* TITLE */}
          <div className="title-row">
            <input
              className="title-input"
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              maxLength={100}
            />

            <span className="edit-icon">
              ✎
            </span>
          </div>

          {/* CONTENT */}
          <textarea
            className="content-input"
            placeholder="Start writing your thoughts..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            rows="5"
          />
        </div>

        {/* FOOTER */}
        <div className="composer-footer">
          <div></div>

          <div className="form-actions">
            {editingNote && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="add-note-button"
            >
              <span>
                {editingNote ? "✓" : "+"}
              </span>

              {editingNote
                ? "Update Note"
                : "Add Note"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default NoteForm;