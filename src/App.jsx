import { useState } from 'react';

import './App.css';

import PageHeader from './components/PageHeader.tsx';
import EventListSection from './components/EventListSection.tsx';
import FooterNote from './components/FooterNote.tsx';
import ToggleMessage from './components/ToggleMessage.tsx';
import Form from './components/Form.tsx';

import { mockEvents } from './data/mockEvents.js';

export default function App() {

  // Dynamic event state
  const [events, setEvents] = useState(mockEvents);

  // Add new event
  function addEvent(newEvent) {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  }

  return (
    <div className="page-shell">

      <PageHeader
        title="Campus Event Planner"
        subtitle="BCDE211 Assessment 3"
      />

      <ToggleMessage />

      <main className="content-stack">

        <EventListSection
          heading="Current Events"
          events={events}
        />

      </main>

      <Form addEvent={addEvent} />

      <FooterNote
        note="Campus Event Planner developed using React."
      />

    </div>
  );
}