import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface State {
  todos: Todo[];
  inputText: string;
  filterOption: string;
}

const useViewModel = () => {
  const [state, setState] = useState<State>({
    todos: [],
    inputText: '',
    filterOption: 'all',
  });

  const handleInputChange = (inputText: string) => {
    setState((prevState) => ({ ...prevState, inputText }));
  };

  const handleAddTodo = () => {
    if (state.inputText.trim() !== '') {
      const newTodo: Todo = {
        id: uuidv4(),
        text: state.inputText,
        completed: false,
      };
      setState((prevState) => ({ ...prevState, todos: [...prevState.todos, newTodo], inputText: '' }));
    }
  };

  const handleDeleteTodo = (id: string) => {
    setState((prevState) => ({ ...prevState, todos: prevState.todos.filter((todo) => todo.id !== id) }));
  };

  const handleToggleComplete = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  };

  const handleEditTodo = (id: string, newText: string) => {
    setState((prevState) => ({
      ...prevState,
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      ),
    }));
  };

  const handleFilterChange = (filterOption: string) => {
    setState((prevState) => ({ ...prevState, filterOption }));
  };

  const handleMarkAllComplete = () => {
    const updatedTodos = state.todos.map((todo) => ({
      ...todo,
      completed: true,
    }));
    setState((prevState) => ({ ...prevState, todos: updatedTodos }));
  };

  const handleDeleteCompleted = () => {
    setState((prevState) => ({ ...prevState, todos: prevState.todos.filter((todo) => !todo.completed) }));
  };

  const countCompletedTasks = () => {
    return state.todos.filter((todo) => todo.completed).length;
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filterOption === 'all') {
      return true;
    } else if (state.filterOption === 'completed') {
      return todo.completed;
    } else {
      return !todo.completed;
    }
  });

  return {
    state,
    handleInputChange,
    handleAddTodo,
    handleDeleteTodo,
    handleToggleComplete,
    handleEditTodo,
    handleFilterChange,
    handleMarkAllComplete,
    handleDeleteCompleted,
    countCompletedTasks,
    filteredTodos,
  };
};

export default useViewModel;