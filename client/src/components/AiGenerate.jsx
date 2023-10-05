import React, { useState } from "react";

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
      <div>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe the to-do list you want..."></textarea>
        <button onClick={createTodoList}>Create To-Do List</button>
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
