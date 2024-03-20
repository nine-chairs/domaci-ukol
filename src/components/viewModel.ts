import { useState, useEffect } from 'react';
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
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      const fetchedTodos: Todo[] = response.data;
      setState((prevState) => ({ ...prevState, todos: fetchedTodos }));
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };


  const handleInputChange = (inputText: string) => {
    setState((prevState) => ({ ...prevState, inputText }));
  };

  const handleAddTodo = async () => {
    if (state.inputText.trim() !== '') {
      const newTodoText = state.inputText;
      try {
        const response = await axios.post(`${apiUrl}/tasks`, { text: newTodoText });
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
    const todoToToggle = state.todos.find(todo => todo.id === id);
    if (!todoToToggle) {
      console.error('Todo not found');
      return;
    }
  
    try {
      if (todoToToggle.completed) {
        const response = await axios.post(`${apiUrl}/tasks/${id}/incomplete`);
        const updatedTodo: Todo = response.data;
        setState(prevState => ({
          ...prevState,
          todos: prevState.todos.map(todo =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          )
        }));
      } else {
        const response = await axios.post(`${apiUrl}/tasks/${id}/complete`);
        const updatedTodo: Todo = response.data;
        setState(prevState => ({
          ...prevState,
          todos: prevState.todos.map(todo =>
            todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
          )
        }));
      }
    } catch (error) {
      console.error('Error toggling complete status:', error);
    }
  };
  
  const handleToggleAllComplete = async () => {
    try {
      const updatedTodos: Todo[] = [];
      for (const todo of state.todos) {
        if (!todo.completed) {
          const response = await axios.post(`${apiUrl}/tasks/${todo.id}/complete`);
          updatedTodos.push(response.data);
        } else {
          updatedTodos.push(todo);
        }
      }
      setState((prevState) => ({ ...prevState, todos: updatedTodos }));
    } catch (error) {
      console.error('Error toggling all todos complete:', error);
    }
  };
  
  const handleDeleteCompleted = async () => {
    try {
      const completedTodos = state.todos.filter((todo) => todo.completed);
      await Promise.all(
        completedTodos.map(async (todo) => {
          await axios.delete(`${apiUrl}/tasks/${todo.id}`);
        })
      );
      setState((prevState) => ({
        ...prevState,
        todos: prevState.todos.filter((todo) => !todo.completed),
      }));
    } catch (error) {
      console.error('Error deleting completed todos:', error);
    }
  };
  
  const countCompletedTodos = () => {
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
    handleToggleAllComplete,
    handleDeleteCompleted,
    countCompletedTodos,
    filteredTodos,
    handleFilterChange,
  };
};

export default useViewModel;