import React from 'react';
import useViewModel from './viewModel';

const TodoManager: React.FC = () => {

  const viewModel = useViewModel()

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        placeholder="Enter a task"
        value={viewModel.state.inputText}
        onChange={e => viewModel.handleInputChange(e.target.value)}
      />
      <button onClick={viewModel.handleAddTodo}>Add Task</button>
      <select value={viewModel.state.filterOption} onChange={e => viewModel.handleFilterChange(e.target.value)}>
        <option value="all">All Tasks</option>
        <option value="completed">Completed Tasks</option>
        <option value="incomplete">Incomplete Tasks</option>
      </select>
      <button onClick={viewModel.handleMarkAllComplete}>Mark All Complete</button>
      <button onClick={viewModel.handleDeleteCompleted}>Delete Completed</button>
      <p>{viewModel.countCompletedTasks()} of {viewModel.state.todos.length} tasks completed</p>
      <ul>
        {viewModel.filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => viewModel.handleToggleComplete(todo.id)}
            />
            {todo.completed ? (
              <del>{todo.text}</del>
            ) : (
              <span>{todo.text}</span>
            )}
            <button onClick={() => viewModel.handleDeleteTodo(todo.id)}>Delete</button>
            <button onClick={() => viewModel.handleEditTodo(todo.id, prompt('Edit task:', todo.text) || '')}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoManager;
