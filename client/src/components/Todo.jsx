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
