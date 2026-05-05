import {type JSX } from "react/jsx-runtime";

type NoteType = string; 

interface FooterNoteProps {
  note: NoteType;
}

export default function FooterNote({ note }: FooterNoteProps): JSX.Element {
  return (
    <footer className="footer-note">
      <small>{note}</small>
    </footer>
  );
}