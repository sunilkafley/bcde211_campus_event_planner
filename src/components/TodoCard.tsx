import { type JSX } from "react/jsx-runtime";

interface TodoCardProps {
  title: string;
  dueDate: string;
  priority: string;
  category: string;
  completed: boolean;
}

export default function TodoCard({
  title,
  dueDate,
  priority,
  category,
  completed
}: TodoCardProps): JSX.Element {
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