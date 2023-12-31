import React from "react";

function TodoControls({ task, setTask, addTodo }) {
  return (
    <div className="whitespace-nowrap">
      <input
        className="border w-[65vw] sm:w-[60vw] text-gray-600 md:w-[35vw] h-12 my-7 shadow-md px-3"
        placeholder="Add a new todo"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        className="h-12 border px-10 ml-2 shadow-md bg-red-500 hover:bg-red-600 text-white font-bold"
        onClick={addTodo}>
        Add
      </button>
    </div>
  );
}

export default TodoControls;
