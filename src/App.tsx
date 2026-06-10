import './App.css'
import { useEffect, useState } from 'react'

import PageHeader from './components/PageHeader'
import EventListSection from './components/EventListSection'
import FooterNote from './components/FooterNote'
import ToggleMessage from './components/ToggleMessage'
import Form from './components/Form'
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

      const sortedEvents = [...loadedEvents].sort((a, b) => {
        if (sortField === 'title') {
          return a.title.localeCompare(b.title)
        }

        return a.date.localeCompare(b.date)
      })

      setEvents(sortedEvents)

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
    try {
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

      <ToggleMessage />
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
        <StatisticsPanel
          totalEvents={totalEvents}
          totalDuration={totalDuration}
        />
        <section>
          <label htmlFor="searchEvents">Search Events:</label>

          <input
            id="searchEvents"
            type="text"
            placeholder="Search by title or tag"
            value={searchTerm}
            onChange={(event) => searchEvents(event.target.value)}
          />
        </section>

        <section>
          <label htmlFor="sortEvents">Sort Events:</label>

          <select
            id="sortEvents"
            value={sortField}
            onChange={(event) =>
              sortEvents(event.target.value as 'date' | 'title')
            }
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </section>

        <EventListSection
          heading="Current Events"
          events={events}
          searchTerm={searchTerm}
          onDelete={deleteEvent}
          onUpdate={updateEvent}
          onRevert={revertEvent}
        />
      </main>

      <Form addEvent={addEvent} />

      <FooterNote note="Campus Event Planner developed using React." />
    </div>
  )
}
