import { EventPlanner } from '../model/event_planner'
import { Event } from '../model/event'
import { IndexedDbEventRepository } from '../repo/indexeddb_event_repository'

import type { CampusEvent } from '../types/CampusEvent'
import type { EventPlannerServiceContract } from '../types/EventPlannerServiceContract'

/**
 * Single repository instance used by the Campus Event Planner.
 *
 * This repository provides the IndexedDB persistence pathway
 * inherited from Assessment 2.
 */
const repository = new IndexedDbEventRepository()

/**
 * Converts a HH:mm time string into total minutes.
 *
 * Examples:
 * 09:30 -> 570
 * 13:15 -> 795
 *
 * The Assessment 2 domain model stores time values as numbers,
 * therefore React UI values must be converted before persistence.
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

/**
 * Converts total minutes into HH:mm format.
 *
 * Examples:
 * 570 -> 09:30
 * 795 -> 13:15
 *
 * Used when converting Assessment 2 model data
 * into React UI data.
 */
function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Service implementation that acts as the bridge between:
 *
 * React UI
 *     ↓
 * Event Planner Service
 *     ↓
 * Assessment 2 EventPlanner
 *     ↓
 * IndexedDB Repository
 *
 * The service contains:
 * - Data mapping
 * - Time conversion
 * - Persistence coordination
 *
 * The service deliberately does NOT manage React state.
 */
class IndexedDbEventPlannerService implements EventPlannerServiceContract {
  private planner: EventPlanner

  constructor() {
    this.planner = new EventPlanner(repository)
  }

  /**
   * Converts an Assessment 2 Event model instance
   * into a CampusEvent used by React components.
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
   * Loads all persisted events using the Assessment 2
   * persistence pathway.
   */
  async getAll(): Promise<CampusEvent[]> {
    const events = await this.planner.getAll()

    return events.map((event) => this.mapToCampusEvent(event))
  }

  /**
   * Adds a new event.
   *
   * Requirement 2:
   * Add New Item
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
   * Updates an existing event using the
   * Assessment 2 Event model.
   *
   * Requirement 4:
   * Edit / Update Existing Item
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
   * Deletes an event from persistence.
   *
   * Requirement 5:
   * Delete Existing Item
   */
  async remove(id: number): Promise<void> {
    await this.planner.remove(id)
  }

  /**
   * Restores the previous version of an event.
   *
   * Requirement 6:
   * Discard / Revert Edits
   */
  async revert(id: number): Promise<void> {
    this.planner.revert(id)
  }

  /**
   * Searches events by title or tags.
   *
   * Requirement 9:
   * Search / Filter Events
   */
  async search(criteria: string): Promise<CampusEvent[]> {
    const matchingEvents = this.planner.find(criteria)

    return matchingEvents.map((event) => this.mapToCampusEvent(event))
  }

  /**
   * Sorts events using the Assessment 2
   * EventPlanner sorting implementation.
   *
   * Requirement 8:
   * Sort Events
   */
  async sort(field: 'title' | 'date'): Promise<CampusEvent[]> {
    const sortedEvents = this.planner.sort(field)

    return sortedEvents.map((event) => this.mapToCampusEvent(event))
  }

  /**
   * Returns the total number of events.
   *
   * Requirement 11:
   * Calculation Across Multiple Items
   */
  async getTotalEvents(): Promise<number> {
    return this.planner.getTotalEvents()
  }

  /**
   * Returns the total duration of all events.
   *
   * Requirement 11:
   * Calculation Across Multiple Items
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
