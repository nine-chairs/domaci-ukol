import React, { useState } from 'react';
import useViewModel from './viewModel';
import './TodoManager.css';
import add from '../icons/add.svg';
import remove from '../icons/remove.svg';

const TodoManager: React.FC = () => {
  const viewModel = useViewModel();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');

  const handleEdit = (todoId: string, currentText: string) => {
    setEditingTaskId(todoId);
    setEditedText(currentText);
  };

  const handleSave = (todoId: string) => {
    viewModel.handleEditTodo(todoId, editedText);
    setEditingTaskId(null);
    setEditedText('');
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditedText('');
  };

  return (
    <div className='todoAppWrapper'>
      <h1>todo list</h1>
      <div className='inputFieldContainer'>
        <input
          className='inputField'
          type="text"
          placeholder="Enter a todo"
          value={viewModel.state.inputText}
          onChange={(e) => viewModel.handleInputChange(e.target.value)}
        />
        <button className='addTodoButton' onClick={viewModel.handleAddTodo}>
          <img className='addIcon' src={add} alt={'add a new todo'} />
        </button>
      </div>

      <div className='optionsContainer'>
        <div className='optionsContainerLeft'>
          <select
            className='todoFilter'
            value={viewModel.state.filterOption}
            onChange={(e) => viewModel.handleFilterChange(e.target.value)}
          >
            <option value="all">All todos</option>
            <option value="completed">Completed todos</option>
            <option value="incomplete">Incomplete todos</option>
          </select>
          <button className='allCompletedButton' onClick={viewModel.handleToggleAllComplete}>
            All Complete
          </button>
        </div>
        <button className='deleteAllCompletedButton' onClick={viewModel.handleDeleteCompleted}>
          <img className='deleteIcon' src={remove} alt={'remove all completed todos'} />
        </button>
      </div>

      <p>
        {viewModel.countCompletedTodos()} of {viewModel.state.todos.length} todos completed
      </p>
      <ul>
        {viewModel.filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => viewModel.handleToggleComplete(todo.id)}
            />
            {editingTaskId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => handleSave(todo.id)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                {todo.completed ? <del>{todo.text}</del> : <span>{todo.text}</span>}
                <button onClick={() => handleEdit(todo.id, todo.text)}>Edit</button>
              </>
            )}
            <button onClick={() => viewModel.handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoManager;
