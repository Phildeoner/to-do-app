import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await axios.post("http://localhost:5000/register", { username, password });
    setUsername("");
    setPassword("");
  };

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
      <div className="flex items-center justify-between p-5 gap-5">
        <div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border p-2 mr-2 shadow-md rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 mr-2 shadow-md rounded"
          />
          <button
            className="border p-2 px-10 ml-2 shadow-md bg-red-500 hover:bg-red-600 text-white font-bold rounded"
            onClick={register}>
            Register
          </button>
        </div>
        <button
          className="flex contents-center items-center gap-2 border p-2 rounded"
          onClick={toggleDarkMode}>
          Mode Switch{" "}
          <svg
            class="w-6 h-6 text-gray-800 dark:text-[#333]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20">
            <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z" />
          </svg>
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col contents-center items-center">
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
