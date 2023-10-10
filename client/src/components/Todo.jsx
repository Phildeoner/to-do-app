import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "./Search";
import Signin from "./Signin";
import AiGenerate from "./AiGenerate";

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

  const addGeneratedTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const clearTodos = async () => {
    try {
      await axios.delete("http://localhost:5000/todos");
      setTodos([]);
      toast.success("Todo List Successfully Cleared!");
    } catch (error) {
      console.error("Error clearing todos:", error);
    }
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <ToastContainer />
      <h1 className="text-2xl md:text-4xl shadow-md font-bold text-center p-5">
        Todo Assistant
      </h1>

      <button
        className="flex contents-center items-center gap-2 border-2 p-1 rounded-full absolute top-7 right-7"
        onClick={toggleDarkMode}>
        {" "}
        <svg
          className="w-4 h-4 text-gray-800 dark:text-[#333]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 20">
          <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z" />
        </svg>
        <svg
          className="w-4 h-4 text-white dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20">
          <path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z" />
        </svg>
      </button>
      <Search />

      <div className="flex flex-col-reverse content-center md:flex-row px-4 md:px-1">
        <div className="flex flex-col content-center items-center w-full md:w-[70vw]">
          <AiGenerate onTodoAdded={addGeneratedTodo} />
        </div>
        <Signin />
      </div>
    </div>
  );
}

export default Todo;
