import './App.css';
import PageHeader from './components/PageHeader.tsx';
import TodoListSection from './components/TodoListSection.tsx';
import FooterNote from './components/FooterNote.tsx';
import ToggleMessage from './components/ToggleMessage.tsx';
import { mockTodos } from './data/mockTodos.js';
import ToggleCount from './components/ToggleCount.tsx';
import Form from './components/Form.tsx';

// <main>...</main> is an HTML semantic element that represents the primary 
// content of a webpage.
export default function App() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Campus Event Planner"
        subtitle="BCDE211 Assessment 3"
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