import React from "react";

function ClearTodo({ clearTodos, todos }) {
  return (
    <div className="mb-10">
      {todos.length > 0 && (
        <button
          className="h-10 border rounded px-10 shadow-md bg-red-500 hover:bg-red-600 text-white font-bold"
          onClick={clearTodos}>
          Clear All
        </button>
      )}
    </div>
  );
}

export default ClearTodo;
