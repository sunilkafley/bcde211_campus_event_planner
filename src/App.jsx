import './App.css';
import PageHeader from './components/PageHeader.jsx';
import TodoListSection from './components/TodoListSection.jsx';
import FooterNote from './components/FooterNote.jsx';
import ToggleMessage from './components/ToggleMessage.jsx';
import { mockTodos } from './data/mockTodos.js';
import ToggleCount from './components/ToggleCount.jsx';
import Form from './components/Form.jsx';

// <main>...</main> is an HTML semantic element that represents the primary 
// content of a webpage.
export default function App() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Campus Event Planner"
        subtitle="BCDE211 Assessment"
      />
        <ToggleMessage> </ToggleMessage>
        <ToggleCount> </ToggleCount>

      <main className="content-stack">
        <TodoListSection
          heading="Current Events"
          todos={mockTodos}
        />
      </main>

      <Form> </Form>

      <FooterNote
        note="Campus Event Planner developed using React. All data is mock data and does not persist."
      />

    </div>
  );
}