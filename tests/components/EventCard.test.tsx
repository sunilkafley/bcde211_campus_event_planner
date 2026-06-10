import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import EventCard from '../../src/components/EventCard'

describe('EventCard', () => {
  const mockDelete = jest.fn()
  const mockUpdate = jest.fn()
  const mockRevert = jest.fn()

  function renderEventCard() {
    return render(
      <EventCard
        id={1}
        title="Football"
        date="2026-06-11"
        startTime="10:00"
        endTime="11:15"
        location="Sydenham"
        tags={['Sports']}
        onDelete={mockDelete}
        onUpdate={mockUpdate}
        onRevert={mockRevert}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders event information', () => {
    renderEventCard()

    expect(screen.getByText('Football')).toBeInTheDocument()

    expect(screen.getByText(/2026-06-11/i)).toBeInTheDocument()

    expect(screen.getByText(/Sydenham/i)).toBeInTheDocument()

    expect(screen.getByText(/Sports/i)).toBeInTheDocument()
  })

  test('renders calculated duration', () => {
    renderEventCard()

    expect(screen.getByText(/1 hour 15 mins/i)).toBeInTheDocument()
  })

  test('calls delete handler when delete button clicked', async () => {
    const user = userEvent.setup()

    renderEventCard()

    await user.click(
      screen.getByRole('button', {
        name: /delete event/i,
      }),
    )

    expect(mockDelete).toHaveBeenCalledTimes(1)

    expect(mockDelete).toHaveBeenCalledWith(1)
  })

  test('enters edit mode when edit button clicked', async () => {
    const user = userEvent.setup()

    renderEventCard()

    await user.click(
      screen.getByRole('button', {
        name: /edit/i,
      }),
    )

    expect(screen.getByDisplayValue('Football')).toBeInTheDocument()

    expect(screen.getByDisplayValue('Sydenham')).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /save/i,
      }),
    ).toBeInTheDocument()
  })

  test('calls update handler when save button clicked', async () => {
    const user = userEvent.setup()

    renderEventCard()

    await user.click(
      screen.getByRole('button', {
        name: /edit/i,
      }),
    )

    const titleInput = screen.getByDisplayValue('Football')

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

  test('calls revert handler when revert button clicked', async () => {
    const user = userEvent.setup()

    renderEventCard()

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
