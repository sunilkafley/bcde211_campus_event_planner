import EventCard from './EventCard'
import type { CampusEvent } from '../types/CampusEvent'

type EventListSectionProps = {
  heading: string
  events: CampusEvent[]
  searchTerm?: string
  onDelete: (id: number) => void
  onUpdate: (event: CampusEvent) => void
  onRevert: (id: number) => void
}
/*
<section></section> represents a thematic grouping of content.
*/
export default function EventListSection({
  heading,
  events,
  searchTerm,
  onDelete,
  onUpdate,
  onRevert,
}: EventListSectionProps) {
  return (
    <section className="panel">
      <h2>{heading}</h2>

      {events.length === 0 ? (
        <p className="empty-state">
          {searchTerm?.trim()
            ? 'No results found. Try a different event title or tag.'
            : 'No events to show yet.'}
        </p>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onRevert={onRevert}
            />
          ))}
        </div>
      )}
    </section>
  )
}
