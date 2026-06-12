import React from 'react'
import { type JSX } from 'react/jsx-runtime'

export default function ToggleMessage(): JSX.Element {
  const [visible, setVisible] = React.useState(false)

  function clickEventHandler(): void {
    setVisible((current) => !current)
  }

  return (
    <section className="planner-tips">
      <button
        type="button"
        className="toggle-button"
        onClick={clickEventHandler}
      >
        {visible ? 'Hide Planner Tips ▲' : 'Show Planner Tips ▼'}
      </button>

      {visible && (
        <div className="tips-content">
          <ul>
            <li>Use a clear and descriptive event title.</li>
            <li>Ensure the end time is after the start time.</li>
            <li>Add meaningful tags to improve searching.</li>
            <li>Include a location for attendees.</li>
          </ul>
        </div>
      )}
    </section>
  )
}
