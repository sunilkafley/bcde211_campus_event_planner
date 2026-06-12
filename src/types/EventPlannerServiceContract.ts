import type { CampusEvent } from './CampusEvent'

/**
 * Service contract for all Campus Event Planner operations.
 *
 * React components interacts with this contract
 * directly accessing repositories or domain models.
 */
export interface EventPlannerServiceContract {
  getAll(): Promise<CampusEvent[]>

  add(event: CampusEvent): Promise<void>

  update(event: CampusEvent): Promise<void>

  remove(id: number): Promise<void>

  revert(id: number): Promise<void>

  search(criteria: string): Promise<CampusEvent[]>

  sort(field: 'title' | 'date'): Promise<CampusEvent[]>

  getTotalEvents(): Promise<number>

  getTotalDuration(): Promise<number>
}
