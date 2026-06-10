import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import StatisticsPanel from '../../src/components/StatisticsPanel'

describe('StatisticsPanel', () => {
  it('shows event statistics', () => {
    render(<StatisticsPanel totalEvents={3} totalDuration={180} />)

    expect(screen.getByText(/Total Events: 3/i)).toBeInTheDocument()

    expect(screen.getByText(/Total Duration: 180 minutes/i)).toBeInTheDocument()
  })
})
