import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], todos: [] });

  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (searchQuery.trim() === "") {
      toast.warning("Please enter a search query!");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/search?query=${searchQuery}`
      );
      setSearchResults(response.data);
      setSearched(true);

      // Set a timeout to clear the search results after 5 seconds
      setTimeout(() => {
        setSearchResults({ users: [], todos: [] });
        setSearched(false);
      }, 10000);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Failed to fetch search results. Please try again!");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  return (
    <>
      <div className="flex flex-col content-center items-center">
        <div className="relative flex">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for users using @ and Task using #..."
            className="border w-[65vw] sm:w-[60vw] md:w-[35vw] h-10 mt-7 mb-3 text-gray-600 shadow-md px-3 rounded-full"
          />
          <button className="absolute bottom-5 right-3" onClick={search}>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-gray-800"
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
    </>
  );
}

export default Search;
