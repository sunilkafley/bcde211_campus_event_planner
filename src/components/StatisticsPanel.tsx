type StatisticsPanelProps = {
  totalEvents: number
  totalDuration: number
}

export default function StatisticsPanel({
  totalEvents,
  totalDuration,
}: StatisticsPanelProps) {
  return (
    <section>
      <h2>Event Statistics</h2>

      <p>Total Events: {totalEvents}</p>

      <p>Total Duration: {totalDuration} minutes</p>
    </section>
  )
}
