interface FooterNoteProps {
  note: string
}

export default function FooterNote({ note }: FooterNoteProps) {
  return (
    <footer className="footer-note">
      <h3> Campus Event Planner</h3>

      <p className="footer-author"> © 2026 Sunil Kafley</p>

      <small>{note}</small>
    </footer>
  )
}
