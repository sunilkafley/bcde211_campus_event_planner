export default function TodoCard({
  title,
  dueDate,
  priority,
  category,
  completed
}) {
  return (
    <article className="card">
      <div className="card-top-row">
        <h3>{title}</h3>
        {completed ? <span className="badge">Done</span> : null}
      </div>

      <p>
        <strong>Due:</strong> {dueDate}
      </p>
      <p>
        <strong>Priority:</strong> {priority}
      </p>
      <p>
        <strong>Category:</strong> {category}
      </p>
    </article>
  );
}