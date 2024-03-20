import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

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

  const apiUrl = 'http://localhost:8080';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      const fetchedTodos: Todo[] = response.data;
      setState((prevState) => ({ ...prevState, todos: fetchedTodos }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };


  const handleInputChange = (inputText: string) => {
    setState((prevState) => ({ ...prevState, inputText }));
  };

  const handleAddTodo = async () => {
    if (state.inputText.trim() !== '') {
      const newTodoText = state.inputText;
      try {
        const response = await axios.post(`${apiUrl}/tasks`, {  text: newTodoText });
        const newTodo: Todo = response.data;
        setState((prevState) => ({ ...prevState, todos: [...prevState.todos, newTodo], inputText: '' }));
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleEditTodo = async (id: string, newText: string) => {
    try {
      const response = await axios.post(`${apiUrl}/tasks/${id}`, { text: newText });
      const updatedTodo: Todo = response.data;
      setState((prevState) => ({
        ...prevState,
        todos: prevState.todos.map((todo) =>
          todo.id === id ? { ...todo, text: updatedTodo.text } : todo
        ),
      }));
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`);
      setState((prevState) => ({ ...prevState, todos: prevState.todos.filter((todo) => todo.id !== id) }));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const response = await axios.post(`${apiUrl}/tasks/${id}/complete`);
      const updatedTodo: Todo = response.data;
      setState((prevState) => ({
        ...prevState,
        todos: prevState.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
        ),
      }));
    } catch (error) {
      console.error('Error toggling complete status:', error);
    }
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

  const handleFilterChange = (filterOption: string) => {
    setState((prevState) => ({ ...prevState, filterOption }));
  };

  return {
    state,
    handleInputChange,
    handleAddTodo,
    handleEditTodo,
    handleDeleteTodo,
    handleToggleComplete,
    handleMarkAllComplete,
    handleDeleteCompleted,
    countCompletedTasks,
    filteredTodos,
    handleFilterChange,
  };
};

export default useViewModel;