import EventCard from "./EventCard";
import type { CampusEvent } from "../types/CampusEvent";

type EventListSectionProps = {
  heading: string;
  events: CampusEvent[];
};

/*
<section></section> represents a thematic grouping of content.
*/
export default function EventListSection({
  heading,
  events,
}: EventListSectionProps) {
  return (
    <section className="panel">
      <h2>{heading}</h2>

      {events.length === 0 ? (
        <p className="empty-state">No events to show yet.</p>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              startTime={event.startTime}
              endTime={event.endTime}
              location={event.location}
              tags={event.tags}
            />
          ))}
        </div>
      )}
    </section>
  );
}