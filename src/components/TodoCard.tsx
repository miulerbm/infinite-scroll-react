//Creando las props del TodoCard:

import React, { FC } from "react";
import { todo } from "../types/todo";

interface TodoCardProps extends React.HTMLAttributes<HTMLParagraphElement> {
  todo: todo;
}

const TodoCard: FC<TodoCardProps> = ({ todo, ...props }) => {
  return (
    <p className="todo-card" key={todo.id} {...props}>
      {todo.title}
    </p>
  );
};

export default TodoCard;
