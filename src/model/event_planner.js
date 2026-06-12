import { Event } from './event.js'

// The EventManager takes cache-first strategy, which means it will try to find
// the requested item in the local cache (#events) first.
export class EventPlanner {
  #repository
  #events
  #backup

  constructor(repository) {
    // The repository is the single source of truth for all data operations
    // (CRUD) on the Event records, since no external system modifies the
    // repository in this application.
    // Writing data should hit the repository first, and then the model will
    // update its local cache (#events) to reflect the changes.
    this.#repository = repository
    this.#events = []
    this.#backup = new Map() // For undo functionality
  }
  /**
   * Adds a new Event to the repository and the planner.
   * The new Event will not have an ID until it is added to the repository.
   * @param {string} title The title of the new Event.
   * @returns {Promise<Event>} A promise that resolves with the new Event if successful.
   * By using the async keyword, the add method indicates that it returns a promise,
   * allowing the caller to handle the asynchronous behaviour properly.
   */

  // R2 + R11
  async add(title, date, startTime, endTime, location = 'TBD', tags = []) {
    const event = new Event(
      null,
      title,
      date,
      startTime,
      endTime,
      location,
      tags,
    )

    const newId = await this.#repository.add(event.toPlainObject())
    event.id = newId

    this.#events.push(event.clone())
    return event
  }

  // Cache-first strategy
  async getById(id) {
    const existing = this.#events.find((e) => e.id === id)
    if (existing) return existing.clone()

    const row = await this.#repository.getById(id)
    if (!row) return null

    const event = new Event(
      row.id,
      row.title,
      row.date,
      row.startTime,
      row.endTime,
      row.location,
      row.tags,
    )

    this.#events.push(event.clone())
    return event
  }

  // R12
  async getAll() {
    if (this.#events.length === 0) {
      await this.loadAll()
    }
    return this.#events.map((e) => e.clone())
  }

  async loadAll() {
    const rows = await this.#repository.getAll()

    this.#events = (rows || []).map(
      (row) =>
        new Event(
          row.id,
          row.title,
          row.date,
          row.startTime,
          row.endTime,
          row.location,
          row.tags,
        ),
    )

    return this.#events
  }

  // R6 + R7
  async update(event) {
    if (!event || event.id == null) {
      throw new Error('Cannot update: missing id')
    }

    const index = this.#events.findIndex((e) => e.id === event.id)

    if (index !== -1) {
      // 🔥 FIX: backup stored internal copy BEFORE overwrite
      this.#backup.set(event.id, this.#events[index].clone())
    }

    await this.#repository.update(event.toPlainObject())

    if (index !== -1) {
      this.#events[index] = event.clone()
    } else {
      this.#events.push(event.clone())
    }

    return event
  }

  // R7
  revert(id) {
    if (!this.#backup.has(id)) {
      throw new Error('No backup found')
    }

    const original = this.#backup.get(id)

    const index = this.#events.findIndex((e) => e.id === id)
    if (index !== -1) {
      this.#events[index] = original.clone()
    }

    return original
  }

  // R5
  async remove(id) {
    await this.#repository.remove(id)
    this.#events = this.#events.filter((e) => e.id !== id)
  }

  // R4 (Search)
  find(criteria) {
    return this.#events.filter(
      (e) =>
        e.title.toLowerCase().includes(criteria.toLowerCase()) ||
        e.tags.includes(criteria),
    )
  }

  // R3 (Sort)
  sort(by = 'date') {
    return [...this.#events].sort((a, b) => (a[by] > b[by] ? 1 : -1))
  }

  // R10 (Calculation across many parts)
  getTotalEvents() {
    return this.#events.length
  }

  getTotalDuration() {
    return this.#events.reduce((sum, e) => sum + e.getDuration(), 0)
  }
}
