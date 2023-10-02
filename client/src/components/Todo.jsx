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
        <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
        <div>
          <input
            className="border w-[30vw] h-10 my-10 shadow-md px-3"
            placeholder="Add a new todo"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button
            className="h-10 border px-10 ml-2 shadow-md bg-red-500 hover:bg-red-600 text-white font-bold"
            onClick={addTodo}>
            Add
          </button>
          <div>
            {todos.map((todo) => (
              <p key={todo._id}>{todo.task}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
