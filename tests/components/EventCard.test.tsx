import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import EventCard from '../../src/components/EventCard'
import type { CampusEvent } from '../../src/types/CampusEvent'

describe('EventCard', () => {
  const mockDelete = jest.fn()
  const mockUpdate = jest.fn()
  const mockRevert = jest.fn()

  const mockEvent: CampusEvent = {
    id: 1,
    title: 'Football Tournament',
    date: '2026-06-13',
    startTime: '11:00',
    endTime: '15:30',
    location: 'Futsal Ground Shirley',
    tags: ['Sports'],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  function renderComponent() {
    return render(
      <EventCard
        event={mockEvent}
        onDelete={mockDelete}
        onUpdate={mockUpdate}
        onRevert={mockRevert}
      />,
    )
  }

  test('renders event information', () => {
    renderComponent()

    expect(screen.getByText('Football Tournament')).toBeInTheDocument()
    expect(screen.getByText(/Sports/i)).toBeInTheDocument()
    expect(screen.getByText(/Futsal Ground Shirley/i)).toBeInTheDocument()
  })

  test('calls delete handler', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /delete/i,
      }),
    )

    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete).toHaveBeenCalledWith(1)
  })

  test('enters edit mode', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /edit/i,
      }),
    )

    expect(screen.getByDisplayValue('Football Tournament')).toBeInTheDocument()
  })

  test('updates an event', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /edit/i,
      }),
    )

    const titleInput = screen.getByDisplayValue('Football Tournament')

    await user.clear(titleInput)
    await user.type(titleInput, 'Football Finals')

    await user.click(
      screen.getByRole('button', {
        name: /save/i,
      }),
    )

    expect(mockUpdate).toHaveBeenCalledTimes(1)

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: 'Football Finals',
      }),
    )
  })

  test('calls revert handler', async () => {
    const user = userEvent.setup()

    renderComponent()

    await user.click(
      screen.getByRole('button', {
        name: /edit/i,
      }),
    )

    await user.click(
      screen.getByRole('button', {
        name: /revert/i,
      }),
    )

    expect(mockRevert).toHaveBeenCalledTimes(1)
    expect(mockRevert).toHaveBeenCalledWith(1)
  })
})
