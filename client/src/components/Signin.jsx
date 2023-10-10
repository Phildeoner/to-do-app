import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!username.trim() || !password.trim()) {
      toast.warning("Both username and password are required!");
      return;
    }

    // Check if username starts with '@'
    if (username.trim()[0] !== "@") {
      toast.warning("Username must start with '@'!");
      return;
    }

    try {
      const response = await axios.post(
        "https://todo-assistant-2kb0.onrender.com/register",
        {
          username,
          password,
        }
      );

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

  return (
    <>
      <div>
        <div className="w-full md:w-[25vw] mt-7 flex flex-col bg-slate-600 p-10 rounded-md shadow-md">
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
            placeholder="@Username"
            className="border text-gray-600 p-2 mb-5 shadow-md rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border text-gray-600 p-2 mb-5 shadow-md rounded"
          />
          <button
            className="border p-2 px-10 shadow-md bg-red-500 hover:bg-red-600 text-white font-bold rounded"
            onClick={register}>
            Register
          </button>
        </div>
      </div>
    </>
  );
}

export default Signin;
