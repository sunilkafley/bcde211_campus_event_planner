import './App.css'
import { useEffect, useState } from 'react'

import PageHeader from './components/PageHeader'
import EventListSection from './components/EventListSection'
import FooterNote from './components/FooterNote'
import Form from './components/Form'
import ToggleMessage from './components/ToggleMessage'

import { OfflineBanner } from './components/OfflineBanner'

import type { CampusEvent } from './types/CampusEvent'
import { eventPlannerService } from './services/eventPlannerService'
import StatisticsPanel from './components/StatisticsPanel'

export default function App() {
  /**
   * React state containing all events currently displayed
   * within the Campus Event Planner.
   */
  const [events, setEvents] = useState<CampusEvent[]>([])

  /**
   * Stores the currently selected sort order.
   */
  const [sortField, setSortField] = useState<'date' | 'title'>('date')

  /**
   * Stores the current search text entered by the user.
   */
  const [searchTerm, setSearchTerm] = useState('')

  /**
   * Stores user-friendly error messages for
   * abnormal or failure cases.
   */
  const [errorTitle, setErrorTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * Stores calculated statistics used by
   * Requirement 11.
   */
  const [totalEvents, setTotalEvents] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)

  /**
   * Loads all persisted events and updates
   * the displayed event list.
   */
  async function refreshEvents(): Promise<void> {
    try {
      const loadedEvents = await eventPlannerService.getAll()

      setEvents(loadedEvents)

      await refreshStatistics()
    } catch (error) {
      console.error('Failed to load persisted events', error)
    }
  }

  /**
   * Calculates summary information across
   * all events for Requirement 11.
   */
  async function refreshStatistics(): Promise<void> {
    try {
      const eventCount = await eventPlannerService.getTotalEvents()
      const duration = await eventPlannerService.getTotalDuration()

      setTotalEvents(eventCount)
      setTotalDuration(duration)
    } catch (error) {
      console.error('Failed to calculate statistics', error)
    }
  }

  /**
   * Sorts the displayed events using the
   * selected field.
   */
  async function sortEvents(field: 'date' | 'title'): Promise<void> {
    try {
      const sortedEvents = await eventPlannerService.sort(field)

      setSortField(field)
      setEvents(sortedEvents)
    } catch (error) {
      console.error('Failed to sort events', error)
    }
  }

  /**
   * Filters events by title or tag.
   * Displays only events whose title
   * or tags match the search criteria.
   */
  async function searchEvents(criteria: string): Promise<void> {
    try {
      setSearchTerm(criteria)

      if (criteria.trim() === '') {
        await refreshEvents()
        return
      }

      const matchingEvents = await eventPlannerService.search(criteria)

      setEvents(matchingEvents)
    } catch (error) {
      console.error('Failed to search events', error)
    }
  }

  /**
   * Loads persisted events when the application starts.
   */
  useEffect(() => {
    refreshEvents()
  }, [])

  /**
   * Saves a new event and refreshes
   * the displayed data.
   */
  async function addEvent(newEvent: CampusEvent): Promise<void> {
    setErrorTitle('')
    setErrorMessage('')

    try {
      /**
       * Prevents users from creating duplicate
       * events with the same title, date and
       * start time.
       */
      const duplicateEvent = events.find(
        (event) =>
          event.title.trim().toLowerCase() ===
            newEvent.title.trim().toLowerCase() &&
          event.date === newEvent.date &&
          event.startTime === newEvent.startTime,
      )

      if (duplicateEvent) {
        setErrorTitle('Unable to Add Event')

        setErrorMessage(
          'An event with the same title, date and start time already exists.',
        )

        return
      }

      await eventPlannerService.add(newEvent)

      await refreshEvents()
    } catch (error) {
      console.error('Failed to save event', error)
    }
  }

  /**
   * Deletes an event and refreshes
   * the displayed data.
   */
  async function deleteEvent(id: number): Promise<void> {
    try {
      await eventPlannerService.remove(id)

      await refreshEvents()
    } catch (error) {
      console.error('Failed to delete event', error)
    }
  }

  /**
   * Updates an existing event and reloads
   * the latest persisted data.
   */
  async function updateEvent(updatedEvent: CampusEvent): Promise<void> {
    setErrorTitle('')
    setErrorMessage('')

    try {
      /**
       * Prevent duplicate events during editing.
       *
       * Excludes the event currently being edited.
       */
      const duplicateEvent = events.find(
        (event) =>
          event.id !== updatedEvent.id &&
          event.title.trim().toLowerCase() ===
            updatedEvent.title.trim().toLowerCase() &&
          event.date === updatedEvent.date &&
          event.startTime === updatedEvent.startTime,
      )

      if (duplicateEvent) {
        setErrorTitle('Unable to Update Event')

        setErrorMessage(
          'An event with the same title, date and start time already exists.',
        )

        return
      }

      await eventPlannerService.update(updatedEvent)

      await refreshEvents()
    } catch (error) {
      console.error('Failed to update event', error)
    }
  }

  /**
   * Reverts an event to the previous
   * saved version stored by EventPlanner.
   */
  async function revertEvent(id: number): Promise<void> {
    setErrorTitle('')
    setErrorMessage('')
    try {
      await eventPlannerService.revert(id)

      await refreshEvents()
    } catch (error) {
      console.error('Failed to revert event', error)
      setErrorTitle('Unable to Revert Event')

      setErrorMessage('This event has not been modified since it was created.')
    }
  }

  return (
    <div className="page-shell">
      <OfflineBanner />

      <PageHeader
        title="Campus Event Planner"
        subtitle="BCDE211 Assessment 3"
      />

      {errorMessage && (
        <section className="notification-banner">
          <div className="notification-content">
            <strong>⚠ {errorTitle}</strong>

            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={() => {
                setErrorTitle('')
                setErrorMessage('')
              }}
            >
              Dismiss
            </button>
          </div>
        </section>
      )}

      <main className="content-stack">
        {/* Welcome + Statistics */}
        <div className="dashboard-overview">
          <section className="panel welcome-panel">
            <h2>Welcome to Campus Event Planner</h2>

            <p>Your all in one tool to manage the campus events effectively.</p>

            <ul className="welcome-features">
              <li>Create new campus event </li>
              <li>Search by title or tag </li>
              <li>Sorts events by title or date</li>
              <li>View event statistics</li>
              <li>Edit, revert and delete events</li>
            </ul>
          </section>

          <StatisticsPanel
            totalEvents={totalEvents}
            totalDuration={totalDuration}
          />
        </div>

        {/* Search */}
        <section className="panel filter-panel">
          <h2>Search Events</h2>

          <div className="filter-row">
            <input
              id="searchEvents"
              type="text"
              placeholder="Search events by title or tag..."
              value={searchTerm}
              onChange={(event) => searchEvents(event.target.value)}
            />

            <select
              value={sortField}
              onChange={(event) =>
                sortEvents(event.target.value as 'date' | 'title')
              }
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </section>

        <EventListSection
          heading="Current Events"
          events={events}
          searchTerm={searchTerm}
          onDelete={deleteEvent}
          onUpdate={updateEvent}
          onRevert={revertEvent}
        />
        <ToggleMessage />
        <Form addEvent={addEvent} />
      </main>
      <FooterNote note="Campus Event Planner developed using React." />
    </div>
  )
}
