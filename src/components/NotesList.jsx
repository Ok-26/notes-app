import NoteCard from "./NoteCard";

function NotesList({
  notes,
  deleteNote,
  editNote,
  search,
}) {
  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {search ? "⌕" : "✦"}
        </div>

        <h3>
          {search
            ? "No notes found"
            : "Your notebook is empty"}
        </h3>

        <p>
          {search
            ? "Try another search keyword."
            : "Create your first note above and start capturing your ideas."}
        </p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          deleteNote={deleteNote}
          editNote={editNote}
        />
      ))}
    </div>
  );
}

export default NotesList;