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
  title,
  date,
  startTime,
  endTime,
  location,
  tags,
}: EventCardProps) {

  // Convert time strings into hours
  const start = Number(startTime.split(":")[0]);
  const end = Number(endTime.split(":")[0]);

  // Requirement 10 - calculation within one item
  const duration = end - start;

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