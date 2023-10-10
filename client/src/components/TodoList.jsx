import React from "react";

function TodoList({ todos, toggleTodo, deleteTodo }) {
  return (
    <div className="mb-5">
      {todos.length === 0 ? (
        <p className="font-semibold md:font-bold text-lg md:text-xl">
          No todo list added
        </p>
      ) : (
        todos.map((todo) => (
          <div
            className={`flex justify-between items-center border p-3 mb-3 relative md:max-w-[45vw] rounded hover:bg-red-400 cursor-pointer text-lg font-semibold ${
              todo.completed ? "line-through" : ""
            }`}
            onClick={() => toggleTodo(todo._id)}>
            <p
              className="font-semibold text-lg md:text-xl whitespace-pre-wrap "
              key={todo._id}>
              {todo.task}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo._id);
              }}>
              <svg
                className="w-6 h-6 text-red-700 hover:text-white dark:text-red-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TodoList;
