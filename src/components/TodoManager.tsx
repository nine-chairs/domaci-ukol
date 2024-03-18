import React, { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoManager: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('all');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputText.trim() !== '') {
      const newTodo: Todo = {
        id: todos.length + 1,
        text: inputText,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEditTodo = (id: number, newText: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const handleFilterChange = (option: string) => {
    setFilterOption(option);
  };

  const handleMarkAllComplete = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: true,
    }));
    setTodos(updatedTodos);
  };

  const handleDeleteCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const countCompletedTasks = () => {
    return todos.filter(todo => todo.completed).length;
  };

  const filteredTodos = todos.filter(todo => {
    if (filterOption === 'all') {
      return true;
    } else if (filterOption === 'completed') {
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
        value={inputText}
        onChange={handleInputChange}
      />
      <button onClick={handleAddTodo}>Add Task</button>
      <div>
        <button onClick={() => handleFilterChange('all')}>All Tasks</button>
        <button onClick={() => handleFilterChange('completed')}>Completed Tasks</button>
        <button onClick={() => handleFilterChange('incomplete')}>Incomplete Tasks</button>
        <button onClick={handleMarkAllComplete}>Mark All Complete</button>
        <button onClick={handleDeleteCompleted}>Delete Completed</button>
      </div>
      <p>{countCompletedTasks()} of {todos.length} tasks completed</p>
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
