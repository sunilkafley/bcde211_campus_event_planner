import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatisticsPanel from '../../src/components/StatisticsPanel'

describe('StatisticsPanel', () => {
  it('shows event statistics', () => {
    render(<StatisticsPanel totalEvents={3} totalDuration={180} />)

    expect(screen.getByText(/Event Statistics/i)).toBeInTheDocument()

    expect(screen.getByText(/Total Events/i)).toBeInTheDocument()

    expect(screen.getByText('3')).toBeInTheDocument()

    expect(screen.getByText(/Total Duration/i)).toBeInTheDocument()

    expect(screen.getByText(/3 hours/i)).toBeInTheDocument()
  })
})
