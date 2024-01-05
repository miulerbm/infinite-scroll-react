import { useInView } from "react-intersection-observer";
import "./App.css";
import TodoCard from "./components/TodoCard";
import { todo } from "./types/todo";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function App() {
  // useInView para infinite scroll automatico:
  const { ref, inView } = useInView();

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
      // Con allPages obtiene las páginas cargadas (si se presiona click serán +1)
      // El método length devuelve el valor como tal.
      // Truco para que ya no devuelva más valores si se ha excedido el número de páginas:
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  // console.log("data", data);

  const content = data?.pages.map((todos: todo[]) =>
    todos.map((todo, index) => {
      if (todos.length == index + 1) {
        // Si se llega al último elemento del array mapeado, entonces se retorna al Card con un ref
        // Sino, se retorna sin ref y por tanto no se considera para triggerear el load more pages

        return <TodoCard innerRef={ref} key={todo.id} todo={todo} />;
      }
      return <TodoCard key={todo.id} todo={todo} />;
    })
  );

  // Cada vez que inView cambia:
  useEffect(() => {
    if (inView && hasNextPage) {
      console.log("Fire!");
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]); //Tmb debe escuchar a los cambios de hasNextPage

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="app">
      {content}
      {isFetchingNextPage && <h3>Loading...</h3>}
    </div>
  );
}

export default App;
