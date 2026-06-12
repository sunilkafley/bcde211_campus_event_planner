import { formatDuration } from '../services/eventPlannerService'

type StatisticsPanelProps = {
  totalEvents: number
  totalDuration: number
}

export default function StatisticsPanel({
  totalEvents,
  totalDuration,
}: StatisticsPanelProps) {
  return (
    <section className="panel stats-panel">
      <h2>Event Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <img
            src="/images/calendar.png"
            alt="Calendar"
            className="stat-icon"
          />

          <span className="stat-label">Total Events</span>

          <span className="stat-value">{totalEvents}</span>
        </div>

        <div className="stat-card">
          <img
            src="/images/duration.png"
            alt="Duration"
            className="stat-icon"
          />

          <span className="stat-label">Total Duration</span>

          <span className="stat-value">{formatDuration(totalDuration)}</span>
        </div>
      </div>
    </section>
  )
}
