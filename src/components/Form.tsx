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

      <form onSubmit={handleSubmit} className="event-form">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Tags separated by commas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button type="submit">Add Event</button>
      </form>
    </section>
  )
}
