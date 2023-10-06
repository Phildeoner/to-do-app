import React, { useState } from "react";
import axios from "axios";
import Skeleton from "./Skeleton";

function AiGenerate({ onTodoAdded }) {
  const [userInput, setUserInput] = useState("");
  const [aiTodos, setAiTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const saveTodoToServer = async (todo) => {
    try {
      const response = await axios.post("http://localhost:5000/todos", {
        task: todo,
        completed: false,
      });
      onTodoAdded(response.data); // Update the main Todo list
    } catch (error) {
      console.error("Error saving to-do to the server:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTodoList = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/create-todo", {
        userInput,
      });
      setAiTodos(response.data.todos);

      // Save each AI-generated to-do to the server
      for (let todo of response.data.todos) {
        await saveTodoToServer(todo);
      }
    } catch (error) {
      console.error("Error creating to-do list:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3 mb-10">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <textarea
              rows="4"
              class="block p-2.5 w-[80vw] md:w-[40vw] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-gray-700 focus:border-gray-700"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe the to-do list you want..."></textarea>
            <button
              className="h-12 border px-10 w-full shadow-md rounded-md bg-red-500 hover:bg-red-600 text-white font-bold"
              onClick={createTodoList}>
              Generate To-Do List
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default AiGenerate;
