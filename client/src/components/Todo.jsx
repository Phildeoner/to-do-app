import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    async function fetchTodos() {
      const response = await axios.get("http://localhost:5000/todos");
      setTodos(response.data);
    }
    fetchTodos();
  }, []);

  const addTodo = async () => {
    const newTodo = { task, completed: false };
    const response = await axios.post("http://localhost:5000/todos", newTodo);
    setTodos([...todos, response.data]);
    setTask("");
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <h1 className="text-4xl font-bold text-center p-5">Todo Application</h1>
      <div className="flex flex-col contents-center items-center">
        <button
          className="flex contents-center items-center gap-2 border p-2 rounded"
          onClick={toggleDarkMode}>
          Mode Switch{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512">
            <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
          </svg>
        </button>
        <div>
          <input
            className="border w-[65vw] sm:w-[60vw] md:w-[35vw] h-12 my-10 shadow-md px-3"
            placeholder="Add a new todo"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
          <button
            className="h-12 border px-10 ml-2 shadow-md bg-red-500 hover:bg-red-600 text-white font-bold"
            onClick={addTodo}>
            Add
          </button>
          <div>
            {todos.map((todo) => (
              <p
                className="border p-3 mb-3 rounded hover:bg-red-400 cursor-pointer text-lg font-semibold"
                key={todo._id}>
                {todo.task}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
