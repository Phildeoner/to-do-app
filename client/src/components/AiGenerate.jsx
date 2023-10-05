import React, { useState } from "react";
import axios from "axios";

function AiGenerate() {
  const [userInput, setUserInput] = useState("");
  const [aiTodos, setAiTodos] = useState([]);

  const createTodoList = async () => {
    try {
      const response = await axios.post("http://localhost:5000/create-todo", {
        userInput,
      });
      setAiTodos(response.data.todos);
    } catch (error) {
      console.error("Error creating to-do list:", error);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3">
        <textarea
          rows="4"
          class="block p-2.5 w-[80vw] md:w-[40vw] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  "
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe the to-do list you want..."></textarea>
        <button
          className="h-12 border px-10 w-full shadow-md rounded-md bg-red-500 hover:bg-red-600 text-white font-bold"
          onClick={createTodoList}>
          Generate To-Do List
        </button>
        <ul>
          {aiTodos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AiGenerate;
