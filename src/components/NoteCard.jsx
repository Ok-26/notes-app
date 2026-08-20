function NoteCard({
  note,
  deleteNote,
  editNote,
}) {
  const formattedDate =
    new Date(note.date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  const formattedTime =
    new Date(note.date).toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  return (
    <article className="note-card">
      <div className="note-card-header">
        <div className="note-title-wrapper">
          <span className="note-color-dot"></span>

          <h4>{note.title}</h4>
        </div>

        <div className="note-actions">
          {/* EDIT */}
          <button
            className="edit-button"
            onClick={() => editNote(note)}
            title="Edit note"
          >
            ✎
          </button>

          {/* DELETE */}
          <button
            className="delete-button"
            onClick={() => deleteNote(note.id)}
            title="Delete note"
          >
            🗑
          </button>
        </div>
      </div>

      <p className="note-content">
        {note.content}
      </p>

      <div className="note-date">
        <span>▣</span>

        {formattedDate}

        <b>•</b>

        {formattedTime}

        {note.updatedAt && (
          <>
            <b>•</b>
            <span className="updated-label">
              Edited
            </span>
          </>
        )}
      </div>
    </article>
  );
}

export default NoteCard;