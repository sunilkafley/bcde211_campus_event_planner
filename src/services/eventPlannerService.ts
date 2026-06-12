import { EventPlanner } from '../model/event_planner'
import { Event } from '../model/event'
import { IndexedDbEventRepository } from '../repo/indexeddb_event_repository'

import type { CampusEvent } from '../types/CampusEvent'
import type { EventPlannerServiceContract } from '../types/EventPlannerServiceContract'

/**
 * Shared IndexedDB repository used by the application.
 */
const repository = new IndexedDbEventRepository()

/**
 * Converts a HH:mm time string into total minutes.
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

/**
 * Converts total minutes into HH:mm format.
 */
function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Formats duration in a
 * user-friendly display format.
 */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }

  if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }

  return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`
}

/**
 * Formats a time value for display using AM/PM notation
 */
export function formatTime(time: string): string {
  const [hoursString, minutes] = time.split(':')
  const hours = Number(hoursString)

  const period = hours >= 12 ? 'PM' : 'AM'

  const displayHours = hours % 12 || 12

  return `${displayHours}:${minutes} ${period}`
}

/**
 * Formats an event date for display
 */
export function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
/**
 * Service layer that coordinates communication
 * between React components and the EventPlanner model.
 *
 */
class IndexedDbEventPlannerService implements EventPlannerServiceContract {
  private planner: EventPlanner

  constructor() {
    this.planner = new EventPlanner(repository)
  }

  /**
   * Maps an Event model into a CampusEvent object.
   */
  private mapToCampusEvent(event: any): CampusEvent {
    return {
      id: event.id,
      title: event.title,
      date: event.date,
      startTime: minutesToTime(event.startTime),
      endTime: minutesToTime(event.endTime),
      location: event.location,
      tags: event.tags ?? [],
    }
  }

  /**
   * Returns all stored events.
   */
  async getAll(): Promise<CampusEvent[]> {
    const events = await this.planner.getAll()

    return events.map((event) => this.mapToCampusEvent(event))
  }

  /**
   * Adds a new event.
   */
  async add(event: CampusEvent): Promise<void> {
    await this.planner.add(
      event.title,
      event.date,
      timeToMinutes(event.startTime),
      timeToMinutes(event.endTime),
      event.location,
      event.tags,
    )
  }

  /**
   * Updates an existing event
   */
  async update(event: CampusEvent): Promise<void> {
    const updatedEvent = new Event(
      event.id,
      event.title,
      event.date,
      timeToMinutes(event.startTime),
      timeToMinutes(event.endTime),
      event.location,
      event.tags,
    )

    await this.planner.update(updatedEvent)
  }

  /**
   * Deletes an event.
   */
  async remove(id: number): Promise<void> {
    await this.planner.remove(id)
  }

  /**
   *Reverts an event to its previous state.
   */
  async revert(id: number): Promise<void> {
    this.planner.revert(id)
  }

  /**
   * Searches events by title or tags.
   */
  async search(criteria: string): Promise<CampusEvent[]> {
    const matchingEvents = this.planner.find(criteria)

    return matchingEvents.map((event) => this.mapToCampusEvent(event))
  }

  /**
   * Sorts events by title and date
   */
  async sort(field: 'title' | 'date'): Promise<CampusEvent[]> {
    const sortedEvents = this.planner.sort(field)

    return sortedEvents.map((event) => this.mapToCampusEvent(event))
  }

  /**
   * Returns the total number of events.
   */
  async getTotalEvents(): Promise<number> {
    return this.planner.getTotalEvents()
  }

  /**
   * Returns the total duration of all events.
   */
  async getTotalDuration(): Promise<number> {
    return this.planner.getTotalDuration()
  }
}

/**
 * Singleton service instance used throughout
 * the Campus Event Planner application.
 */
export const eventPlannerService = new IndexedDbEventPlannerService()
