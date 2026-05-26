import { Event } from '../../src/model/event.js'

describe('Event Entity', () => {
  test('should create an event instance with valid inputs', () => {
    // Arrange
    const id = 1
    const title = 'Campus Meetup'
    const date = '2026-01-01'
    const startTime = 10
    const endTime = 12

    // Act
    const event = new Event(id, title, date, startTime, endTime, '', [])
    const result = event.toPlainObject()

    // Assert
    expect(event.id).toBe(id)
    expect(result).toEqual({
      id,
      title,
      date,
      startTime,
      endTime,
      location: '',
      tags: [],
    })
  })

  test('should allow updating the id', () => {
    // Arrange
    const initialId = null
    const newId = 100
    const event = new Event(initialId, 'Temp Event', '2026-01-01', 10, 12)

    // Act
    event.id = newId

    // Assert
    expect(event.id).toBe(newId)
  })

  test('toPlainObject should include id if it is 0 (falsy but valid)', () => {
    // Arrange
    const id = 0
    const event = new Event(id, 'Zero ID', '2026-01-01', 10, 12)

    // Act
    const plain = event.toPlainObject()

    // Assert
    expect(plain.id).toBe(id)
  })

  test('should throw error for invalid title', () => {
    // Arrange / Act / Assert
    expect(() => {
      new Event(null, '', '2026-01-01', 10, 12)
    }).toThrow('Title is required')
  })

  test('should throw error for invalid time range', () => {
    // Arrange / Act / Assert
    expect(() => {
      new Event(null, 'Bad Event', '2026-01-01', 12, 10)
    }).toThrow()
  })

  test('should calculate duration correctly', () => {
    // Arrange
    const event = new Event(null, 'Duration Test', '2026-01-01', 9, 11)

    // Act
    const duration = event.getDuration()

    // Assert
    expect(duration).toBe(2)
  })

  test('should update title correctly', () => {
    // Arrange
    const event = new Event(null, 'Old', '2026-01-01', 10, 12)

    // Act
    event.update({ title: 'New' })

    // Assert
    expect(event.title).toBe('New')
  })

  test('should update location and tags', () => {
    // Arrange
    const event = new Event(null, 'Test', '2026-01-01', 10, 12)

    // Act
    event.update({ location: 'Room A', tags: ['fun'] })

    // Assert
    expect(event.location).toBe('Room A')
    expect(event.tags).toContain('fun')
  })

  test('should throw error for invalid title in update', () => {
    // Arrange
    const event = new Event(null, 'Valid', '2026-01-01', 10, 12)

    // Act & Assert
    expect(() => event.update({ title: '' })).toThrow('Invalid title')
  })

  test('should throw error for invalid time update', () => {
    // Arrange
    const event = new Event(null, 'Test', '2026-01-01', 10, 12)

    // Act & Assert
    expect(() => event.update({ startTime: 12, endTime: 10 })).toThrow(
      'Invalid time range',
    )
  })

  test('clone should create a new identical object', () => {
    // Arrange
    const event = new Event(1, 'Clone', '2026-01-01', 10, 12)

    // Act
    const copy = event.clone()

    // Assert
    expect(copy).not.toBe(event)
    expect(copy.title).toBe(event.title)
  })

  test('toPlainObject should exclude id if null', () => {
    // Arrange
    const event = new Event(null, 'Plain', '2026-01-01', 10, 12)

    // Act
    const obj = event.toPlainObject()

    // Assert
    expect(obj.id).toBeUndefined()
  })

  test('should throw error if date is missing', () => {
    expect(() => {
      new Event(null, 'Test', null, 10, 12)
    }).toThrow('Date is required')
  })

  test('update should not change values if fields not provided', () => {
    const event = new Event(null, 'Test', '2026-01-01', 10, 12)

    event.update({})

    expect(event.title).toBe('Test')
  })
})
