import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], todos: [] });

  const [searched, setSearched] = useState(false);

  const register = async () => {
    if (!username.trim() || !password.trim()) {
      toast.warning("Both username and password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });

      if (response.status === 200) {
        toast.success("User successfully created!");
      } else if (
        response.data &&
        response.data.error === "Username already exists"
      ) {
        toast.warning(
          "Username already exists. Please choose a different username."
        );
      } else {
        toast.error("Error creating user. Please try again.");
      }

      setUsername("");
      setPassword("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.error === "Username already exists"
      ) {
        toast.warning(
          "Username already exists. Please choose a different username."
        );
      } else {
        toast.error("Error creating user. Please try again.");
      }
    }
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

  const search = async () => {
    if (searchQuery.trim() === "") {
      toast.warning("Please enter a search query!");
      return;
    }

    const response = await axios.get(
      `http://localhost:5000/search?query=${searchQuery}`
    );
    setSearchResults(response.data);
    setSearched(true); // Set searched to true after getting results
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
      <h1 className="text-4xl font-bold text-center p-5">Todo Application</h1>

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
      <div className="flex flex-col content-center items-center">
        <div className="relative flex">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="border w-[65vw] sm:w-[60vw] md:w-[35vw] h-10 mt-7 mb-3 shadow-md px-3 rounded-full"
          />
          <button className="-ml-10 mt-4" onClick={search}>
            <svg
              class="w-6 h-6 text-white dark:text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </div>
        {searched && (
          <div className="flex gap-40">
            <div>
              <h3 className="font-bold">Users:</h3>
              {searchResults.users.map((user) => (
                <p key={user._id}>{user.username}</p>
              ))}
            </div>
            <div>
              <h3 className="font-bold">Todos:</h3>
              {searchResults.todos.map((todo) => (
                <p key={todo._id}>{todo.task}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        <div className="flex flex-col contents-center items-center w-[70vw]">
          <div>
            <input
              className="border w-[65vw] sm:w-[60vw] md:w-[35vw] h-12 my-7 shadow-md px-3"
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
        <div className="w-[25vw] mt-7 flex flex-col bg-slate-600 p-10 rounded-md shadow-md">
          <h1 className="font-bold text-2xl text-center mb-5">
            Create An Account
          </h1>
          <p className="mb-5 text-justify text-base text-white">
            Create an account to be able to search for other users and tag them
            to your own list of todo.
          </p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border p-2 mb-5 shadow-md rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 mb-5 shadow-md rounded"
          />
          <button
            className="border p-2 px-10 shadow-md bg-red-500 hover:bg-red-600 text-white font-bold rounded"
            onClick={register}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Todo;
