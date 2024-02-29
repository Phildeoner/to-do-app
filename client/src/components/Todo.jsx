import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "./Search";
import Signin from "./Signin";
import AiGenerate from "./AiGenerate";
import TodoList from "./TodoList";
import TodoControls from "./TodoControls";
import TopBar from "./TopBar";
import ClearTodo from "./ClearTodo";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get(
          "https://todo-backend-tc9m.onrender.com/todos"
        );
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
        toast.error("Failed to fetch todos!");
      }
    }
    fetchTodos();
  }, []);

  const addTodo = async () => {
    try {
      if (task.trim() === "") {
        toast.warning("Please enter a valid todo!");
        return;
      }

      const tags = task.match(/@\w+/g) || [];
      const hashtags = task.match(/#\w+/g) || [];

      const newTodo = { task, completed: false, tags, hashtags };
      const response = await axios.post(
        "https://todo-backend-tc9m.onrender.com/todos",
        newTodo
      );
      setTodos([...todos, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo!");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://todo-backend-tc9m.onrender.com/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete todo!");
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updatedTodos = todos.map((todo) => {
        if (todo._id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      setTodos(updatedTodos);

      const todoToUpdate = updatedTodos.find((todo) => todo._id === id);
      await axios.put(
        `https://todo-backend-tc9m.onrender.com/todos/${id}`,
        todoToUpdate
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast.error("Failed to toggle todo!");
      setTodos(todos); // Revert changes only if there's an error
    }
  };

  const addGeneratedTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const clearTodos = async () => {
    try {
      await axios.delete("https://todo-backend-tc9m.onrender.com/todos");
      setTodos([]);
      toast.success("Todo List Successfully Cleared!");
    } catch (error) {
      toast.error("Error clearing todos:", error);
    }
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <ToastContainer />
      <TopBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Search />

      <div className="flex flex-col-reverse content-center md:flex-row px-4 md:px-1">
        <div className="flex flex-col content-center items-center w-full md:w-[70vw]">
          <div>
            <TodoControls task={task} setTask={setTask} addTodo={addTodo} />
            <TodoList
              todos={todos}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
            <ClearTodo clearTodos={clearTodos} todos={todos} />
            <AiGenerate onTodoAdded={addGeneratedTodo} />
          </div>
        </div>
        <Signin />
      </div>
    </div>
  );
}

export default Todo;
