import { type JSX } from "react/jsx-runtime";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  tags: string[];
}

export default function EventCard({
  id,
  title,
  date,
  startTime,
  endTime,
  location,
  tags
}: EventCardProps): JSX.Element {
  // Requirement 10
  // Calculation within ONE item
  const duration = 0;

  return (
    <article className="card">
      <div className="card-top-row">
        <h3>{title}</h3>

        <span className="badge">Upcoming</span>
      </div>

      <p>
        <strong>Date:</strong> {date}
      </p>

      <p>
        <strong>Time:</strong> {startTime} - {endTime}
      </p>

      <p>
        <strong>Duration:</strong> {duration} hours
      </p>

      <p>
        <strong>Location:</strong> {location}
      </p>

      <p>
        <strong>Tags:</strong> {tags.join(", ")}
      </p>
    </article>
  );
}
