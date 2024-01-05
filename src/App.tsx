import { useEffect, useState } from "react";
import "./App.css";
import TodoCard from "./components/TodoCard";
import { todo } from "./types/todo";

function App() {
  const [todos, setTodos] = useState<todo[]>([]);

  // Creating a function for fetching random data
  const fetchTodos = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_page=1"
    );
    const data = await res.json();
    setTodos(data);
  };

  /**
   * Con el useEffect llamamos a
   */
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app">
      {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export default App;
