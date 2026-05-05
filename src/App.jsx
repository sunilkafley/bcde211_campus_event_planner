import './App.css';
import PageHeader from './components/PageHeader'
import TodoListSection from './components/TodoListSection'
import FooterNote from './components/FooterNote'
import ToggleMessage from './components/ToggleMessage'
import { mockTodos } from './data/mockTodos'
import ToggleCount from './components/ToggleCount'
import Form from './components/Form'

export default function App() {
  return (
    <div className="page-shell">
      <PageHeader
        title="Campus Event Planner"
        subtitle="BCDE211 Assessment 3"
      />

      <ToggleMessage />
      <ToggleCount />

      <main className="content-stack">
        <TodoListSection
          heading="Current Events"
          todos={mockTodos}
        />
      </main>

      <Form />

      <FooterNote
        note="Campus Event Planner developed using React. All data is mock data and does not persist."
      />
    </div>
  );
}