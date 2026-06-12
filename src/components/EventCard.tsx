import { useState } from 'react'
import type { CampusEvent } from '../types/CampusEvent'

import {
  formatDuration,
  formatEventDate,
  formatTime,
} from '../services/eventPlannerService'

/**
 * Properties required to render an event card.
 */
interface EventCardProps {
  event: CampusEvent
  onDelete: (id: number) => void
  onUpdate: (event: CampusEvent) => void
  onRevert: (id: number) => void
}

export default function EventCard({
  event,
  onDelete,
  onUpdate,
  onRevert,
}: EventCardProps) {
  const { id, title, date, startTime, endTime, location, tags } = event
  /**
   * Tracks whether the event card is currently
   * being edited.
   */
  const [isEditing, setIsEditing] = useState(false)

  /**
   * Local editable copy of the event.
   */
  const [editedEvent, setEditedEvent] = useState<CampusEvent>(event)

  /**
   * Updates a single event field in the editable event.
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
   * Event duration calculated from the
   * selected start and end times.
   */
  const [startHours, startMinutes] = editedEvent.startTime
    .split(':')
    .map(Number)

  const [endHours, endMinutes] = editedEvent.endTime.split(':').map(Number)

  const durationMinutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes)

  return (
    <article className={`card ${isEditing ? 'editing' : ''}`}>
      <div className="card-top-row">
        {isEditing ? (
          <div className="edit-row">
            <label>Title:</label>
            <input
              type="text"
              value={editedEvent.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </div>
        ) : (
          <h3>{title}</h3>
        )}

        {!isEditing && <span className="badge">Upcoming</span>}
      </div>

      {isEditing ? (
        <div className="edit-row">
          <label>Date:</label>

          <input
            type="date"
            value={editedEvent.date}
            onChange={(e) => updateField('date', e.target.value)}
          />
        </div>
      ) : (
        <p>
          <strong>Date:</strong> {formatEventDate(date)}
        </p>
      )}

      {isEditing ? (
        <>
          <div className="edit-row">
            <label>Start Time:</label>

            <input
              type="time"
              value={editedEvent.startTime}
              onChange={(e) => updateField('startTime', e.target.value)}
            />
          </div>

          <div className="edit-row">
            <label>End Time:</label>

            <input
              type="time"
              value={editedEvent.endTime}
              onChange={(e) => updateField('endTime', e.target.value)}
            />
          </div>
        </>
      ) : (
        <p>
          <strong>Time:</strong> {formatTime(startTime)} - {formatTime(endTime)}
        </p>
      )}

      <p>
        <strong>Duration:</strong>{' '}
        {durationMinutes > 0
          ? formatDuration(durationMinutes)
          : 'Invalid time range'}
      </p>

      {isEditing ? (
        <div className="edit-row">
          <label>Location:</label>

          <input
            type="text"
            value={editedEvent.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
        </div>
      ) : (
        <p>
          <strong>Location:</strong> {location}
        </p>
      )}

      {isEditing ? (
        <div className="edit-row">
          <label>Tags:</label>

          <input
            type="text"
            value={editedEvent.tags.join(', ')}
            onChange={(e) =>
              updateField(
                'tags',
                e.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>
      ) : (
        <p>
          <strong>Tags:</strong> {tags.join(', ')}
        </p>
      )}

      <div className="card-actions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="save-btn"
              disabled={durationMinutes <= 0}
              onClick={() => {
                onUpdate(editedEvent)
                setIsEditing(false)
              }}
            >
              Save
            </button>
            <button
              type="button"
              className="edit-btn"
              onClick={() => {
                setEditedEvent(event)

                setIsEditing(false)
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="edit-btn"
              onClick={() => {
                onRevert(id)

                setEditedEvent(event)

                setIsEditing(false)
              }}
            >
              Revert
            </button>
          </>
        ) : (
          <button
            type="button"
            className="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}

        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(id)}
        >
          Delete Event
        </button>
      </div>
    </article>
  )
}
