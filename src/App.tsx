import { useState } from 'react';

import './App.css';

import PageHeader from './components/PageHeader';
import EventListSection from './components/EventListSection';
import FooterNote from './components/FooterNote';
import ToggleMessage from './components/ToggleMessage';
import Form from './components/Form';
import { OfflineBanner } from './components/OfflineBanner';

import { mockEvents } from './data/mockEvents';
import type { CampusEvent } from './types/CampusEvent';

export default function App() {

  // Dynamic event state
  const [events, setEvents] = useState<CampusEvent[]>(mockEvents);

  // Add new event
  function addEvent(newEvent: CampusEvent) {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  }

  return (
    <div className="page-shell">

      <OfflineBanner />

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