import TodoCard from './TodoCard.jsx';

/*
    <section></section> is a standard HTML element. <section> represents a 
    thematic grouping of content—basically a logical section of a page.
 */
export default function TodoListSection({ heading, todos }) {
  return (
    <section className="panel">
      <h2>{heading}</h2>

      {todos.length === 0 ? (
        <p className="empty-state">No tasks to show yet.</p>
      ) : (
        <div className="card-grid">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              title={todo.title}
              dueDate={todo.dueDate}
              priority={todo.priority}
              category={todo.category}
              completed={todo.completed}
            />
          ))}
        </div>
      )}
    </section>
  );
}