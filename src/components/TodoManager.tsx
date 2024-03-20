import React from 'react';
import useViewModel from './viewModel';
import './TodoManager.css';
import add from '../icons/add.svg';
import remove from '../icons/remove.svg';

const TodoManager: React.FC = () => {
  const viewModel = useViewModel();

  return (
    <div className='toDoAppWrapper'>
      <h1>to do list</h1>
      <div className='inputFieldContainer'>
        <input
          className='inputField'
          type="text"
          placeholder="Enter a task"
          value={viewModel.state.inputText}
          onChange={(e) => viewModel.handleInputChange(e.target.value)}
        />
        <button className='addToDoButton' onClick={viewModel.handleAddTodo}>
          <img className='addIcon' src={add} alt={'add a new task'} />
        </button>
      </div>

      <div className='optionsContainer'>
        <div className='optionsContainerLeft'>
          <select
            className='toDoFilter'
            value={viewModel.state.filterOption}
            onChange={(e) => viewModel.handleFilterChange(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed Tasks</option>
            <option value="incomplete">Incomplete Tasks</option>
          </select>
          <button className='allCompletedButton' onClick={viewModel.handleMarkAllComplete}>
            All Complete
          </button>
        </div>
        <button className='deleteAllCompletedButton' onClick={viewModel.handleDeleteCompleted}>
          <img className='deleteIcon' src={remove} alt={'remove all completed tasks'} />
        </button>
      </div>

      <p>
        {viewModel.countCompletedTasks()} of {viewModel.state.todos.length} tasks completed
      </p>
      <ul>
        {viewModel.filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => viewModel.handleToggleComplete(todo.id)}
            />
            {todo.completed ? <del>{todo.text}</del> : <span>{todo.text}</span>}
            <button onClick={() => viewModel.handleDeleteTodo(todo.id)}>Delete</button>
            <button
              onClick={() =>
                viewModel.handleEditTodo(todo.id, prompt('Edit task:', todo.text) || '')
              }
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoManager;