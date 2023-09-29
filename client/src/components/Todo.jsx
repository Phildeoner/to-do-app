import React, { useState, useEffect } from "react";
import axios from "axios";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

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
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>{todo.task}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
