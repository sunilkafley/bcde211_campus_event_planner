import React from 'react'
import type { CampusEvent } from '../types/CampusEvent'

interface FormProps {
  addEvent: (event: CampusEvent) => void
}

export default function Form({ addEvent }: FormProps) {
  const [title, setTitle] = React.useState('')
  const [date, setDate] = React.useState('')
  const [startTime, setStartTime] = React.useState('')
  const [endTime, setEndTime] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [tags, setTags] = React.useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newEvent: CampusEvent = {
      id: 0,

      title,
      date,
      startTime,
      endTime,
      location,

      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    addEvent(newEvent)

    // Clear form
    setTitle('')
    setDate('')
    setStartTime('')
    setEndTime('')
    setLocation('')
    setTags('')
  }

  return (
    <section className="panel">
      <h2>Add New Event</h2>

      <p className="form-subtitle">
        Create and manage campus events and activities.
      </p>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-row">
          <label htmlFor="event-title">Event Title</label>

          <input
            id="event-title"
            type="text"
            placeholder="e.g. Best Programming Practices Workshop"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="date-time-row">
          <div className="form-row">
            <label htmlFor="event-date">Event Date</label>

            <input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="start-time">Start Time </label>

            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="end-time">End Time </label>

            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="location">Location</label>

          <input
            id="location"
            type="text"
            placeholder="e.g. Ara City Campus"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="tags">Tags</label>

          <input
            id="tags"
            type="text"
            placeholder="e.g. Careers, Workshop, Sports, Software"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button type="submit">Add Event</button>
      </form>
    </section>
  )
}
