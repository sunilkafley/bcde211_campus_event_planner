import { EventPlanner } from '../../src/model/event_planner.js'
import { Event } from '../../src/model/event.js'

describe('EventPlanner', () => {
  let mockRepo
  let planner

  beforeEach(() => {
    // Arrange
    mockRepo = {
      add: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }

    planner = new EventPlanner(mockRepo)
  })

  // ---------- add ----------
  describe('add()', () => {
    test('should add event and update cache', async () => {
      // Arrange
      mockRepo.add.mockResolvedValue(1)

      // Act
      const event = await planner.add('Test Event', '2026-01-01', 10, 12)
      const all = await planner.getAll()

      // Assert
      expect(event).toBeInstanceOf(Event)
      expect(event.id).toBe(1)
      expect(all.length).toBe(1)
    })
  })

  // ---------- getById ----------
  describe('getById()', () => {
    test('should return from cache', async () => {
      mockRepo.add.mockResolvedValue(1)

      const event = await planner.add('Cached', '2026-01-01', 10, 12)

      const result = await planner.getById(event.id)

      expect(result).toEqual(event)
    })

    test('should fetch from repository', async () => {
      mockRepo.getById.mockResolvedValue({
        id: 1,
        title: 'Repo Event',
        date: '2026-01-01',
        startTime: 10,
        endTime: 12,
      })

      const result = await planner.getById(1)

      expect(result.title).toBe('Repo Event')
    })

    test('should return null if repo returns null', async () => {
      mockRepo.getById.mockResolvedValue(null)

      const result = await planner.getById(999)

      expect(result).toBeNull()
    })
  })

  // ---------- getAll ----------
  describe('getAll()', () => {
    test('should load from repo when cache empty', async () => {
      mockRepo.getAll.mockResolvedValue([
        {
          id: 1,
          title: 'Repo Event',
          date: '2026-01-01',
          startTime: 10,
          endTime: 12,
        },
      ])

      const result = await planner.getAll()

      expect(result.length).toBe(1)
    })

    test('should return from cache without calling repo', async () => {
      mockRepo.add.mockResolvedValue(1)

      await planner.add('Cached', '2026-01-01', 10, 12)

      const result = await planner.getAll()

      expect(result.length).toBe(1)
      expect(mockRepo.getAll).not.toHaveBeenCalled()
    })
  })

  // ---------- update ----------
  describe('update()', () => {
    test('should update existing event', async () => {
      mockRepo.add.mockResolvedValue(1)

      const event = await planner.add('Old', '2026-01-01', 10, 12)

      event.update({ title: 'Updated' })
      await planner.update(event)

      expect(mockRepo.update).toHaveBeenCalled()
    })

    test('should add event if not in cache', async () => {
      const event = new Event(1, 'New', '2026-01-01', 10, 12)
      mockRepo.update.mockResolvedValue()

      await planner.update(event)

      const all = await planner.getAll()

      expect(all.length).toBe(1)
    })

    test('should throw if missing id', async () => {
      await expect(planner.update({})).rejects.toThrow()
    })
  })

  // ---------- revert ----------
  describe('revert()', () => {
    test('should revert changes', async () => {
      mockRepo.add.mockResolvedValue(1)

      const event = await planner.add('Original', '2026-01-01', 10, 12)

      event.update({ title: 'Changed' })
      await planner.update(event)

      const reverted = planner.revert(event.id)

      expect(reverted.title).toBe('Original')
    })

    test('should throw if no backup', () => {
      expect(() => planner.revert(999)).toThrow('No backup found')
    })
  })

  // ---------- remove ----------
  describe('remove()', () => {
    test('should remove event', async () => {
      mockRepo.add.mockResolvedValue(1)

      const event = await planner.add('Delete', '2026-01-01', 10, 12)

      await planner.remove(event.id)

      expect(mockRepo.remove).toHaveBeenCalledWith(event.id)
    })

    test('should handle removing non-existing event', async () => {
      await planner.remove(999)

      expect(mockRepo.remove).toHaveBeenCalledWith(999)
    })
  })

  // ---------- find ----------
  describe('find()', () => {
    test('should match by tag', async () => {
      mockRepo.add.mockResolvedValue(1)

      await planner.add('Music Event', '2026-01-01', 10, 12, 'Hall', ['music'])

      const result = planner.find('music')

      expect(result.length).toBe(1)
    })

    test('should match by title', async () => {
      mockRepo.add.mockResolvedValue(1)

      await planner.add('Football Event', '2026-01-01', 10, 12)

      const result = planner.find('football')

      expect(result.length).toBe(1)
    })

    test('should return empty if no match', async () => {
      mockRepo.add.mockResolvedValue(1)

      await planner.add('Music', '2026-01-01', 10, 12)

      const result = planner.find('sports')

      expect(result.length).toBe(0)
    })
  })

  // ---------- sort ----------
  describe('sort()', () => {
    test('should sort by date', async () => {
      mockRepo.add.mockResolvedValueOnce(1)
      mockRepo.add.mockResolvedValueOnce(2)

      await planner.add('Later', '2026-02-01', 10, 12)
      await planner.add('Earlier', '2026-01-01', 10, 12)

      const sorted = planner.sort('date')

      expect(sorted[0].title).toBe('Earlier')
    })

    test('should sort by title', async () => {
      mockRepo.add.mockResolvedValueOnce(1)
      mockRepo.add.mockResolvedValueOnce(2)

      await planner.add('B Event', '2026-01-01', 10, 12)
      await planner.add('A Event', '2026-01-01', 10, 12)

      const sorted = planner.sort('title')

      expect(sorted[0].title).toBe('A Event')
    })
  })

  // ---------- calculations ----------
  describe('calculations', () => {
    test('should return total events', async () => {
      mockRepo.add.mockResolvedValue(1)

      await planner.add('E1', '2026-01-01', 10, 12)
      await planner.add('E2', '2026-01-02', 10, 12)

      const total = planner.getTotalEvents()

      expect(total).toBe(2)
    })

    test('should return total duration', async () => {
      mockRepo.add.mockResolvedValue(1)

      await planner.add('E1', '2026-01-01', 10, 12)
      await planner.add('E2', '2026-01-02', 10, 13)

      const total = planner.getTotalDuration()

      expect(total).toBe(5)
    })

    test('should return 0 when no events', () => {
      const total = planner.getTotalDuration()
      expect(total).toBe(0)
    })
  })
})