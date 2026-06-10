import type { CampusEvent } from '../types/CampusEvent'
import { useState } from 'react'

interface EventCardProps {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  tags: string[]
  onDelete: (id: number) => void
  onUpdate: (event: CampusEvent) => void
  onRevert: (id: number) => void
}

export default function EventCard({
  id,
  title,
  date,
  startTime,
  endTime,
  location,
  tags,
  onDelete,
  onUpdate,
  onRevert,
}: EventCardProps) {
  /**
   * Tracks whether the card is currently being edited.
   */
  const [isEditing, setIsEditing] = useState(false)

  /**
   * Local editable copy of the event.
   *
   * Changes remain local until Save is clicked.
   */
  const [editedEvent, setEditedEvent] = useState<CampusEvent>({
    id,
    title,
    date,
    startTime,
    endTime,
    location,
    tags,
  })

  /**
   * Updates a single field while preserving the
   * rest of the event state.
   */
  function updateField<K extends keyof CampusEvent>(
    field: K,
    value: CampusEvent[K],
  ): void {
    setEditedEvent((current) => ({
      ...current,
      [field]: value,
    }))
  }

  /**
   * Converts a HH:mm time string into total minutes.
   *
   * Example:
   * 09:30 -> 570
   */
  function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)

    return hours * 60 + minutes
  }

  const startMinutes = timeToMinutes(editedEvent.startTime)

  const endMinutes = timeToMinutes(editedEvent.endTime)

  const durationMinutes = endMinutes - startMinutes

  const durationHours = Math.floor(durationMinutes / 60)

  const remainingMinutes = durationMinutes % 60

  return (
    <article className="card">
      <div className="card-top-row">
        {isEditing ? (
          <input
            type="text"
            value={editedEvent.title}
            onChange={(event) => updateField('title', event.target.value)}
          />
        ) : (
          <h3>{title}</h3>
        )}

        <span className="badge">Upcoming</span>
      </div>

      <p>
        <strong>Date:</strong>{' '}
        {isEditing ? (
          <input
            type="date"
            value={editedEvent.date}
            onChange={(event) => updateField('date', event.target.value)}
          />
        ) : (
          date
        )}
      </p>

      {isEditing ? (
        <>
          <p>
            <strong>Start:</strong>{' '}
            <input
              type="time"
              value={editedEvent.startTime}
              onChange={(event) => updateField('startTime', event.target.value)}
            />
          </p>

          <p>
            <strong>End:</strong>{' '}
            <input
              type="time"
              value={editedEvent.endTime}
              onChange={(event) => updateField('endTime', event.target.value)}
            />
          </p>
        </>
      ) : (
        <p>
          <strong>Time:</strong> {startTime} - {endTime}
        </p>
      )}

      <p>
        <strong>Duration:</strong>{' '}
        {durationHours > 0 &&
          `${durationHours} hour${durationHours !== 1 ? 's' : ''}`}
        {durationHours > 0 && remainingMinutes > 0 && ' '}
        {remainingMinutes > 0 &&
          `${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`}
      </p>

      <p>
        <strong>Location:</strong>{' '}
        {isEditing ? (
          <input
            type="text"
            value={editedEvent.location}
            onChange={(event) => updateField('location', event.target.value)}
          />
        ) : (
          location
        )}
      </p>

      <p>
        <strong>Tags:</strong>{' '}
        {isEditing ? (
          <input
            type="text"
            value={editedEvent.tags.join(', ')}
            onChange={(event) =>
              updateField(
                'tags',
                event.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              )
            }
          />
        ) : (
          tags.join(', ')
        )}
      </p>

      <div className="card-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => {
                onUpdate(editedEvent)
                setIsEditing(false)
              }}
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => {
                onRevert(id)

                setEditedEvent({
                  id,
                  title,
                  date,
                  startTime,
                  endTime,
                  location,
                  tags,
                })

                setIsEditing(false)
              }}
            >
              Revert
            </button>

            <button
              type="button"
              onClick={() => {
                setEditedEvent({
                  id,
                  title,
                  date,
                  startTime,
                  endTime,
                  location,
                  tags,
                })

                setIsEditing(false)
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}

        <button type="button" onClick={() => onDelete(id)}>
          Delete Event
        </button>
      </div>
    </article>
  )
}
