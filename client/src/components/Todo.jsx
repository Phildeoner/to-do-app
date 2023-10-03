import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "./Search";
import Signin from "./Signin";

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
    if (task.trim() === "") {
      toast.warning("Please enter a valid todo!");
      return;
    }

    const tags = task.match(/@\w+/g) || [];
    const hashtags = task.match(/#\w+/g) || [];

    const newTodo = { task, completed: false, tags, hashtags };
    const response = await axios.post("http://localhost:5000/todos", newTodo);
    setTodos([...todos, response.data]);
    setTask("");
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const toggleTodo = async (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo._id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);

    const todoToUpdate = updatedTodos.find((todo) => todo._id === id);
    await axios.put(`http://localhost:5000/todos/${id}`, todoToUpdate);
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <ToastContainer />
      <h1 className="text-2xl md:text-4xl font-bold text-center p-5">
        Todo Application
      </h1>

      <button
        className="flex contents-center items-center gap-2 border-2 p-1 rounded-full absolute top-7 right-7"
        onClick={toggleDarkMode}>
        {" "}
        <svg
          class="w-4 h-4 text-gray-800 dark:text-[#333]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 20">
          <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z" />
        </svg>
        <svg
          class="w-4 h-4 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20">
          <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z" />
        </svg>
      </button>
      <Search />

      <div className="flex flex-col-reverse content-center md:flex-row px-4 md:px-1">
        <div className="flex flex-col content-center items-center w-full sm:w-[70vw]">
          <div className="whitespace-nowrap">
            <input
              className="border w-[65vw] sm:w-[60vw] text-gray-600 md:w-[35vw] h-12 my-7 shadow-md px-3"
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
            <div className="mb-20 md:mb-10">
              {todos.length === 0 ? (
                <p className="font-bold text-2xl">No todo list added</p>
              ) : (
                todos.map((todo) => (
                  <div
                    className={`flex justify-between items-center border p-3 mb-3 rounded hover:bg-red-400 cursor-pointer text-lg font-semibold ${
                      todo.completed ? "line-through" : ""
                    }`}
                    onClick={() => toggleTodo(todo._id)}>
                    <p key={todo._id}>{todo.task}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(todo._id);
                      }}>
                      <svg
                        class="w-6 h-6 text-gray-800 hover:text-white dark:text-red-700"
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
          </div>
        </div>
        <Signin />
      </div>
    </div>
  );
}

export default Todo;
