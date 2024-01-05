// import { useEffect, useState } from "react";
import "./App.css";
import TodoCard from "./components/TodoCard";
import { todo } from "./types/todo";
import { useInfiniteQuery } from "@tanstack/react-query";

function App() {
  // const [todos, setTodos] = useState<todo[]>([]);

  // Creating a function for fetching random data
  const fetchTodos = async ({ pageParam }: { pageParam: number }) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}`
    );
    return res.json();
  };

  // Deestructuramos la respuesta del useInfiniteQuery:
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      console.log({ lastPage, allPages });
      // Con allPages obtiene las páginas cargadas (si se presiona click serán +1)
      // El método length devuelve el valor como tal.
      // return 20 + 1;
      // Truco para que ya no devuelva más valores si se ha excedido el número de páginas:
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  console.log("data", data);

  const content = data?.pages.map((todos: todo[]) =>
    todos.map((todo) => {
      return <TodoCard key={todo.id} todo={todo} />;
    })
  );

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="app">
      {content}
      {/* Si el hasNextPage es falso, ya no debería mostrarse el botón */}
      <button
        disabled={!hasNextPage || isFetchingNextPage}
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage
          ? "Loading more ..."
          : hasNextPage
          ? "Load more"
          : "Nothing more to load"}
      </button>
      {/* {todos.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))} */}
    </div>
  );
}

export default App;
