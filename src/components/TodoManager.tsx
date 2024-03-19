import React, { useState } from 'react';
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

const TodoManager: React.FC = () => {
  const [state, setState] = useState<State>({
    todos: [],
    inputText: '',
    filterOption: 'all',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, inputText: e.target.value });
  };

  const handleAddTodo = () => {
    if (state.inputText.trim() !== '') {
      const newTodo: Todo = {
        id: uuidv4(),
        text: state.inputText,
        completed: false,
      };
      setState({ ...state, todos: [...state.todos, newTodo], inputText: '' });
    }
  };

  const handleDeleteTodo = (id: string) => {
    setState({ ...state, todos: state.todos.filter(todo => todo.id !== id) });
  };

  const handleToggleComplete = (id: string) => {
    setState({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    });
  };

  const handleEditTodo = (id: string, newText: string) => {
    setState({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      ),
    });
  };

  const handleFilterChange = (option: string) => {
    setState({ ...state, filterOption: option });
  };

  const handleMarkAllComplete = () => {
    const updatedTodos = state.todos.map(todo => ({
      ...todo,
      completed: true,
    }));
    setState({ ...state, todos: updatedTodos });
  };

  const handleDeleteCompleted = () => {
    setState({ ...state, todos: state.todos.filter(todo => !todo.completed) });
  };

  const countCompletedTasks = () => {
    return state.todos.filter(todo => todo.completed).length;
  };

  const filteredTodos = state.todos.filter(todo => {
    if (state.filterOption === 'all') {
      return true;
    } else if (state.filterOption === 'completed') {
      return todo.completed;
    } else {
      return !todo.completed;
    }
  });

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        placeholder="Enter a task"
        value={state.inputText}
        onChange={handleInputChange}
      />
      <button onClick={handleAddTodo}>Add Task</button>
      <select value={state.filterOption} onChange={e => handleFilterChange(e.target.value)}>
        <option value="all">All Tasks</option>
        <option value="completed">Completed Tasks</option>
        <option value="incomplete">Incomplete Tasks</option>
      </select>
      <button onClick={handleMarkAllComplete}>Mark All Complete</button>
      <button onClick={handleDeleteCompleted}>Delete Completed</button>
      <p>{countCompletedTasks()} of {state.todos.length} tasks completed</p>
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id)}
            />
            {todo.completed ? (
              <del>{todo.text}</del>
            ) : (
              <span>{todo.text}</span>
            )}
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            <button onClick={() => handleEditTodo(todo.id, prompt('Edit task:', todo.text) || '')}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoManager;
