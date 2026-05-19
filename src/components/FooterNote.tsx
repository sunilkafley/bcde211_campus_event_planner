type FooterNoteProps = {
  note: string;
};

export default function FooterNote({ note }: FooterNoteProps) {
  return (
    <footer className="footer-note">
      <small>{note}</small>
    </footer>
  );
}