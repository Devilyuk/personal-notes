import "./NotesListView.css";
import { FC } from "react";
import { NoteList } from "../../api/Note";
import { NoteView } from "../NoteView";
interface NoteListViewProps {
  notes: NoteList;
}

export const NotesListView: FC<NoteListViewProps> = ({ notes }) => {

  return (
    <div className="note-list-view__list">
      {notes.list.map(note => (
        <div key={note.id}><NoteView note={note} /></div>
      ))}
    </div>
  );
};
