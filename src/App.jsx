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
        title="Todo Manager"
        subtitle="BCDE211 Week 08 React Fundamentals Starter"
      />
        <ToggleMessage> </ToggleMessage>
        <ToggleCount> </ToggleCount>

      <main className="content-stack">
        <TodoListSection
          heading="Current Tasks"
          todos={mockTodos}
        />
      </main>

      <Form> </Form>

      <FooterNote
        note="Week 08 focus: JSX, components, props, composition, lists, keys, and light conditional rendering."
      />

    </div>
  );
}